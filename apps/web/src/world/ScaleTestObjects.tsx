import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import * as THREE from "three";
import {
  SCALE_TEST_PLACEMENTS,
  scaleTestPlacementTransform,
  type ScaleTestPlacement,
} from "./ScaleTestPlacements";

function ScaleTestAsset({ placement }: { placement: ScaleTestPlacement }) {
  const { scene } = useGLTF(placement.asset);
  const { object, anchorOffset } = useMemo(() => {
    const clonedObject = scene.clone(true);
    clonedObject.updateMatrixWorld(true);

    const bounds = new THREE.Box3().setFromObject(clonedObject);
    const center = bounds.getCenter(new THREE.Vector3());

    return {
      object: clonedObject,
      anchorOffset: new THREE.Vector3(-center.x, -bounds.min.y, -center.z),
    };
  }, [scene]);
  const transform = useMemo(() => scaleTestPlacementTransform(placement), [placement]);

  return (
    <group position={transform.position} quaternion={transform.rotation}>
      <group scale={[placement.scale, placement.scale, placement.scale]}>
        <primitive object={object} position={anchorOffset} />
      </group>
    </group>
  );
}

export function ScaleTestObjects() {
  return (
    <group>
      {SCALE_TEST_PLACEMENTS.map((placement, index) => (
        <ScaleTestAsset key={`${placement.asset}-${index}`} placement={placement} />
      ))}
    </group>
  );
}

useGLTF.preload("/scale-test-assets/tree.glb");
useGLTF.preload("/scale-test-assets/pine-tree.glb");
useGLTF.preload("/scale-test-assets/small-rock.glb");
useGLTF.preload("/scale-test-assets/bush.glb");
