import { Text, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { PLANET_RADIUS } from "../core/worldConfig";
import { evaluateTerrainHeight } from "../procedural/TerrainHeight";
import {
  STARTER_WOODLAND_SCENERY,
  type SceneryAssetDefinition,
} from "./SceneryCatalog";

const START_UP = new THREE.Vector3(0, 1, 0);
const START_RIGHT = new THREE.Vector3(1, 0, 0);
const START_FORWARD = new THREE.Vector3(0, 0, -1);
const REVIEW_DISTANCE = 70;
const REVIEW_SPACING = 18;
const SURFACE_CLEARANCE = 0.12;

function reviewScale(asset: SceneryAssetDefinition) {
  return (asset.scaleMin + asset.scaleMax) * 0.5;
}

function reviewDirection(index: number, count: number) {
  const centeredIndex = index - (count - 1) * 0.5;
  return START_UP.clone()
    .multiplyScalar(PLANET_RADIUS)
    .addScaledVector(START_RIGHT, centeredIndex * REVIEW_SPACING)
    .addScaledVector(START_FORWARD, REVIEW_DISTANCE)
    .normalize();
}

function surfaceTransform(direction: THREE.Vector3) {
  const height = evaluateTerrainHeight(direction);
  const position = direction.clone().multiplyScalar(
    PLANET_RADIUS + height + SURFACE_CLEARANCE,
  );
  const rotation = new THREE.Quaternion().setFromUnitVectors(START_UP, direction);

  return { position, rotation };
}

function ReviewLabel({
  number,
  asset,
  position,
}: {
  number: number;
  asset: SceneryAssetDefinition;
  position: THREE.Vector3;
}) {
  const ref = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame(() => {
    ref.current?.quaternion.copy(camera.quaternion);
  });

  return (
    <group ref={ref} position={position}>
      <Text
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        fontSize={2.3}
        outlineColor="#000000"
        outlineWidth={0.12}
      >
        {`${number}. ${asset.id}`}
      </Text>
    </group>
  );
}

function ReviewAsset({
  asset,
  index,
  count,
}: {
  asset: SceneryAssetDefinition;
  index: number;
  count: number;
}) {
  const { scene } = useGLTF(asset.url);
  const scale = reviewScale(asset);
  const direction = useMemo(() => reviewDirection(index, count), [count, index]);
  const transform = useMemo(() => surfaceTransform(direction), [direction]);
  const { object, anchorOffset, labelHeight } = useMemo(() => {
    const clonedObject = scene.clone(true);
    clonedObject.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(clonedObject);
    const center = bounds.getCenter(new THREE.Vector3());
    const height = Math.max(2, bounds.max.y - bounds.min.y);

    return {
      object: clonedObject,
      anchorOffset: new THREE.Vector3(-center.x, -bounds.min.y, -center.z),
      labelHeight: height * scale + 5,
    };
  }, [scale, scene]);
  const labelPosition = useMemo(
    () => transform.position.clone().addScaledVector(direction, labelHeight),
    [direction, labelHeight, transform.position],
  );

  return (
    <>
      <group position={transform.position} quaternion={transform.rotation}>
        <group scale={[scale, scale, scale]}>
          <primitive object={object} position={anchorOffset} />
        </group>
      </group>
      <ReviewLabel
        number={index + 1}
        asset={asset}
        position={labelPosition}
      />
    </>
  );
}

export function AssetScaleReview() {
  return (
    <group>
      {STARTER_WOODLAND_SCENERY.map((asset, index) => (
        <ReviewAsset
          key={asset.id}
          asset={asset}
          index={index}
          count={STARTER_WOODLAND_SCENERY.length}
        />
      ))}
    </group>
  );
}

for (const asset of STARTER_WOODLAND_SCENERY) {
  useGLTF.preload(asset.url);
}
