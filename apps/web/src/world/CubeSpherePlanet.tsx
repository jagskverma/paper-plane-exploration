import { useMemo } from "react";
import * as THREE from "three";

export const PLANET_RADIUS = 4000;

// --- GLSL Simplex 3D noise ---
const NOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m*m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float fbm(vec3 p, int octaves, float lacunarity, float gain) {
  float value = 0.0;
  float amplitude = 1.0;
  float frequency = 1.0;
  float maxValue = 0.0;
  for (int i = 0; i < 8; i++) {
    if (i >= octaves) break;
    value += amplitude * snoise(p * frequency);
    maxValue += amplitude;
    frequency *= lacunarity;
    amplitude *= gain;
  }
  return value / maxValue;
}
`;

const VERTEX_SHADER = /* glsl */ `
uniform float uAmplitude;
uniform float uFrequency;
uniform float uOctaves;
uniform float uLacunarity;
uniform float uGain;
varying float vHeight;
varying vec3 vNormal;

${NOISE_GLSL}

void main() {
  vec3 pos = position;
  vec3 spherePos = normalize(pos) * ${PLANET_RADIUS.toFixed(1)};
  
  float h = fbm(spherePos * uFrequency, int(uOctaves), uLacunarity, uGain);
  float displacement = h * uAmplitude;
  
  vec3 newPos = spherePos * (1.0 + displacement / ${PLANET_RADIUS.toFixed(1)});
  
  vHeight = h;
  vNormal = normalize(normalMatrix * normalize(spherePos));
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
}
`;

const FRAGMENT_SHADER = /* glsl */ `
varying float vHeight;
varying vec3 vNormal;

uniform vec3 uLightDir;
uniform vec3 uColorDeep;
uniform vec3 uColorLow;
uniform vec3 uColorMid;
uniform vec3 uColorHigh;
uniform vec3 uColorPeak;

void main() {
  float h = vHeight * 0.5 + 0.5;
  
  vec3 color;
  if (h < 0.3) {
    color = mix(uColorDeep, uColorLow, h / 0.3);
  } else if (h < 0.55) {
    color = mix(uColorLow, uColorMid, (h - 0.3) / 0.25);
  } else if (h < 0.8) {
    color = mix(uColorMid, uColorHigh, (h - 0.55) / 0.25);
  } else {
    color = mix(uColorHigh, uColorPeak, (h - 0.8) / 0.2);
  }
  
  float diff = max(0.2, dot(normalize(vNormal), normalize(uLightDir)));
  color *= diff;
  
  gl_FragColor = vec4(color, 1.0);
}
`;

function buildFaceGeometry(axis: "x" | "y" | "z", sign: number, res: number) {
  const verts: number[] = [];
  const idx: number[] = [];
  const stride = res + 1;

  for (let i = 0; i <= res; i++) {
    for (let j = 0; j <= res; j++) {
      const u = (i / res) * 2 - 1;
      const v = (j / res) * 2 - 1;

      let x: number, y: number, z: number;
      if (axis === "x") { x = sign; y = v; z = u; }
      else if (axis === "y") { x = u; y = sign; z = v; }
      else { x = u; y = v; z = sign; }

      const len = Math.sqrt(x * x + y * y + z * z);
      verts.push((x / len) * PLANET_RADIUS, (y / len) * PLANET_RADIUS, (z / len) * PLANET_RADIUS);
    }
  }

  for (let i = 0; i < res; i++) {
    for (let j = 0; j < res; j++) {
      const a = i * stride + j;
      const b = a + 1;
      const c = a + stride;
      const d = c + 1;
      idx.push(a, b, d, a, d, c);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.setIndex(idx);
  geo.computeVertexNormals();
  return geo;
}

interface FaceDef {
  axis: "x" | "y" | "z";
  sign: number;
}

const FACES: FaceDef[] = [
  { axis: "x", sign: 1 },
  { axis: "x", sign: -1 },
  { axis: "y", sign: 1 },
  { axis: "y", sign: -1 },
  { axis: "z", sign: 1 },
  { axis: "z", sign: -1 },
];

export function CubeSpherePlanet() {
  const geometries = useMemo(() => {
    const res = 48;
    return FACES.map((f) => buildFaceGeometry(f.axis, f.sign, res));
  }, []);

  const uniforms = useMemo(
    () => ({
      uAmplitude: { value: 600 },
      uFrequency: { value: 0.0004 },
      uOctaves: { value: 6 },
      uLacunarity: { value: 2.0 },
      uGain: { value: 0.5 },
      uLightDir: { value: new THREE.Vector3(0.6, 0.8, 0.4).normalize() },
      uColorDeep: { value: new THREE.Color("#1a4a8a") },
      uColorLow: { value: new THREE.Color("#3a7a4a") },
      uColorMid: { value: new THREE.Color("#8a9a5a") },
      uColorHigh: { value: new THREE.Color("#aaaa8a") },
      uColorPeak: { value: new THREE.Color("#ffffff") },
    }),
    [],
  );

  return (
    <group>
      {geometries.map((geo, i) => (
        <mesh key={i} geometry={geo}>
          <shaderMaterial
            vertexShader={VERTEX_SHADER}
            fragmentShader={FRAGMENT_SHADER}
            uniforms={uniforms}
          />
        </mesh>
      ))}
    </group>
  );
}
