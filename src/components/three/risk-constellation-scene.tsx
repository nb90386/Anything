"use client";

// The actual three.js scene. Only ever mounted client-side, behind a
// prefers-reduced-motion check and a next/dynamic(ssr:false) boundary, see
// risk-constellation.tsx. Kept deliberately simple: no orbit controls, no
// scroll-jacking, nothing that fights the reader for attention. It exists to
// make one page feel considered, not to prove a 3D library was installed.

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

const RISK_COLORS = ["#22c55e", "#22c55e", "#f59e0b", "#ef4444", "#a78bfa"];
const NODE_COUNT = 26;

interface Node {
  position: [number, number, number];
  color: string;
  scale: number;
}

function generateNodes(): Node[] {
  const nodes: Node[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const theta = (i / NODE_COUNT) * Math.PI * 2 + Math.sin(i) * 0.4;
    const radius = 2.1 + Math.cos(i * 1.7) * 0.9;
    const y = Math.sin(i * 0.9) * 1.4;
    nodes.push({
      position: [Math.cos(theta) * radius, y, Math.sin(theta) * radius],
      color: RISK_COLORS[i % RISK_COLORS.length],
      scale: 0.05 + (i % 3) * 0.025,
    });
  }
  return nodes;
}

function ConnectionLines({ nodes }: { nodes: Node[] }) {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const center = new THREE.Vector3(0, 0, 0);
    nodes.forEach((n, i) => {
      if (i % 2 === 0) {
        points.push(center, new THREE.Vector3(...n.position));
      }
    });
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [nodes]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color="#7c3aed" transparent opacity={0.18} />
    </lineSegments>
  );
}

function CoreNode() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.scale.setScalar(0.34 + Math.sin(t * 1.4) * 0.03);
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#7c3aed" emissive="#6d28d9" emissiveIntensity={1.4} roughness={0.25} />
    </mesh>
  );
}

function Constellation() {
  const groupRef = useRef<THREE.Group>(null);
  const nodes = useMemo(() => generateNodes(), []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.08;
  });

  return (
    <group ref={groupRef}>
      <CoreNode />
      <ConnectionLines nodes={nodes} />
      {nodes.map((n, i) => (
        <mesh key={i} position={n.position}>
          <sphereGeometry args={[n.scale, 16, 16]} />
          <meshStandardMaterial color={n.color} emissive={n.color} emissiveIntensity={0.8} />
        </mesh>
      ))}
    </group>
  );
}

export function RiskConstellationScene() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{ position: [0, 0.6, 6.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 4]} intensity={40} color="#a78bfa" />
      <pointLight position={[-4, -2, -2]} intensity={20} color="#6d28d9" />
      <Constellation />
      <Sparkles count={40} scale={7} size={1.4} speed={0.15} color="#c4b5fd" opacity={0.5} />
      <EffectComposer>
        <Bloom intensity={0.65} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
