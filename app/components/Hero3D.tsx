"use client";

import { useRef, useSyncExternalStore } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Group } from "three";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}

type Shape = {
  kind: "coin" | "ball" | "ring" | "capsule";
  position: [number, number, number];
  color: string;
  scale: number;
};

const shapes: Shape[] = [
  { kind: "coin", position: [-4.2, 1.2, 0], color: "#ffffff", scale: 1.1 },
  { kind: "ball", position: [-2.4, -1.4, 1], color: "#0b1020", scale: 0.8 },
  { kind: "ring", position: [0.5, 1.8, -1], color: "#ffffff", scale: 1 },
  { kind: "capsule", position: [2.6, -0.8, 0], color: "#c7d0ff", scale: 1 },
  { kind: "coin", position: [4.4, 1.4, -0.5], color: "#0b1020", scale: 0.9 },
  { kind: "ball", position: [0.2, -2.2, 0.5], color: "#ffffff", scale: 0.6 },
];

function ShapeMesh({ kind, color }: Pick<Shape, "kind" | "color">) {
  return (
    <mesh>
      {kind === "coin" && <cylinderGeometry args={[1, 1, 0.28, 48]} />}
      {kind === "ball" && <sphereGeometry args={[1, 48, 48]} />}
      {kind === "ring" && <torusGeometry args={[0.9, 0.32, 24, 64]} />}
      {kind === "capsule" && <capsuleGeometry args={[0.4, 1, 8, 24]} />}
      <meshStandardMaterial color={color} roughness={0.35} metalness={0.1} />
    </mesh>
  );
}

function Scene({ reduce }: { reduce: boolean }) {
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current || reduce) return;
    group.current.rotation.y +=
      (state.pointer.x * 0.3 - group.current.rotation.y) * 0.05;
    group.current.rotation.x +=
      (-state.pointer.y * 0.2 - group.current.rotation.x) * 0.05;
  });

  return (
    <group ref={group}>
      {shapes.map((s, i) => (
        <Float
          key={i}
          speed={reduce ? 0 : 1.2 + i * 0.15}
          rotationIntensity={reduce ? 0 : 1.2}
          floatIntensity={reduce ? 0 : 1.5}
        >
          <group position={s.position} scale={s.scale} rotation={[1, 0.5, 0]}>
            <ShapeMesh kind={s.kind} color={s.color} />
          </group>
        </Float>
      ))}
    </group>
  );
}

export default function Hero3D() {
  const reduce = usePrefersReducedMotion();

  return (
    <Canvas camera={{ position: [0, 0, 9], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={1.1} />
      <directionalLight position={[5, 5, 5]} intensity={2.2} />
      <directionalLight position={[-5, -3, 2]} intensity={0.8} />
      <Scene reduce={reduce} />
    </Canvas>
  );
}
