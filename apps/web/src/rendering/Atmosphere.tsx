import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";

export function Atmosphere() {
  const { scene } = useThree();

  useEffect(() => {
    /* eslint-disable react-hooks/immutability */
    scene.fog = new THREE.Fog("#6b7fa8", 30, 150);
    scene.background = new THREE.Color("#6b7fa8");
    /* eslint-enable react-hooks/immutability */
    return () => {
      /* eslint-disable react-hooks/immutability */
      scene.fog = null;
      scene.background = null;
      /* eslint-enable react-hooks/immutability */
    };
  }, [scene]);

  return (
    <>
      <directionalLight
        position={[100, 30, 50]}
        intensity={1.8}
        color="#ffe4c4"
      />
      <directionalLight
        position={[-50, 80, -30]}
        intensity={0.4}
        color="#a8c8ff"
      />
      <ambientLight intensity={0.5} color="#d0c8e0" />
      <Skydome topColor="#3b5998" bottomColor="#f7c59f" />
    </>
  );
}

function Skydome({
  topColor,
  bottomColor,
}: {
  topColor: string;
  bottomColor: string;
}) {
  const geo = useMemo(() => {
    const top = new THREE.Color(topColor);
    const bottom = new THREE.Color(bottomColor);
    const g = new THREE.SphereGeometry(200, 32, 16);
    const colors: number[] = [];
    const positions = g.attributes.position.array as Float32Array;

    for (let i = 0; i < positions.length; i += 3) {
      const y = positions[i + 1];
      const t = (y / 200 + 1) / 2;
      const color = new THREE.Color().lerpColors(bottom, top, t);
      colors.push(color.r, color.g, color.b);
    }

    g.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    return g;
  }, [topColor, bottomColor]);

  return (
    <mesh geometry={geo}>
      <meshBasicMaterial
        vertexColors
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}
