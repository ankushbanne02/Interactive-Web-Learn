import { useRef, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/context/AppContext";

// ─── Scene object metadata ─────────────────────────────────────────────────────

interface SceneObject {
  id: string;
  nameKey: string;
  infoKey: string;
  factKey: string;
  emojiKey: string;
}

const sceneObjects: SceneObject[] = [
  { id: "dam",          nameKey: "obj.dam.name",         infoKey: "obj.dam.info",         factKey: "obj.dam.fact",         emojiKey: "obj.dam.emoji" },
  { id: "turbine",      nameKey: "obj.turbine.name",     infoKey: "obj.turbine.info",     factKey: "obj.turbine.fact",     emojiKey: "obj.turbine.emoji" },
  { id: "generator",    nameKey: "obj.generator.name",   infoKey: "obj.generator.info",   factKey: "obj.generator.fact",   emojiKey: "obj.generator.emoji" },
  { id: "transformer",  nameKey: "obj.transformer.name", infoKey: "obj.transformer.info", factKey: "obj.transformer.fact", emojiKey: "obj.transformer.emoji" },
  { id: "lines",        nameKey: "obj.lines.name",       infoKey: "obj.lines.info",       factKey: "obj.lines.fact",       emojiKey: "obj.lines.emoji" },
  { id: "house",        nameKey: "obj.house.name",       infoKey: "obj.house.info",       factKey: "obj.house.fact",       emojiKey: "obj.house.emoji" },
];

const accentColors: Record<string, string> = {
  dam: "#38bdf8", turbine: "#06b6d4", generator: "#a78bfa",
  transformer: "#fbbf24", lines: "#94a3b8", house: "#34d399",
};
const chipEmojis: Record<string, string> = {
  dam: "💧", turbine: "⚙️", generator: "🔋", transformer: "🔌", lines: "🗼", house: "🏠",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function Box3({ pos, size, color, emissive = "#000", emissiveIntensity = 0, onClick }: {
  pos: [number, number, number]; size: [number, number, number];
  color: string; emissive?: string; emissiveIntensity?: number; onClick?: () => void;
}) {
  return (
    <mesh position={pos} onClick={onClick} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={emissiveIntensity} />
    </mesh>
  );
}

function Cyl3({ pos, args, color, emissive = "#000", ei = 0, rot, onClick }: {
  pos: [number, number, number]; args: [number, number, number, number];
  color: string; emissive?: string; ei?: number; rot?: [number, number, number]; onClick?: () => void;
}) {
  return (
    <mesh position={pos} rotation={rot ?? [0, 0, 0]} onClick={onClick} castShadow>
      <cylinderGeometry args={args} />
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={ei} />
    </mesh>
  );
}

// ─── Animated electricity particles ─────────────────────────────────────────

type Segment = { from: THREE.Vector3; to: THREE.Vector3; len: number };

function buildSegments(waypoints: [number, number, number][]): Segment[] {
  const segs: Segment[] = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const from = new THREE.Vector3(...waypoints[i]);
    const to   = new THREE.Vector3(...waypoints[i + 1]);
    segs.push({ from, to, len: from.distanceTo(to) });
  }
  return segs;
}

function ElectricParticle({ waypoints, speed = 4, offset = 0, color = "#fef08a" }: {
  waypoints: [number, number, number][]; speed?: number; offset?: number; color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const segs = useMemo(() => buildSegments(waypoints), [waypoints]);
  const totalLen = useMemo(() => segs.reduce((s, g) => s + g.len, 0), [segs]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    let t = ((clock.getElapsedTime() * speed + offset) % totalLen + totalLen) % totalLen;
    for (const seg of segs) {
      if (t <= seg.len) {
        const pct = t / seg.len;
        ref.current.position.lerpVectors(seg.from, seg.to, pct);
        break;
      }
      t -= seg.len;
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.09, 6, 6]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
    </mesh>
  );
}

// Main electricity path waypoints through all components
const mainPath: [number, number, number][] = [
  [-9, 0.5, 0],   // dam outflow
  [-6.8, 0.3, 0], // turbine
  [-4, 0.3, 0],   // generator
  [-1.5, 1.2, 0], // transformer top
  [1.5, 1.2, 0],  // top cable
  [3.2, 2.8, 0],  // tower top
  [5.5, 2.8, 0],  // mid tower
  [7.5, 0.8, 0],  // distribution transformer
  [9.5, 0.5, 0],  // house
];

function ElectricityFlow() {
  return (
    <>
      {[0, 3, 6, 9, 12].map((off) => (
        <ElectricParticle key={off} waypoints={mainPath} speed={3.5} offset={off} color="#fef08a" />
      ))}
    </>
  );
}

// ─── Wire / cable ─────────────────────────────────────────────────────────────

function Cable({ points, color = "#fbbf24", opacity = 0.8 }: { points: [number,number,number][]; color?: string; opacity?: number }) {
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(...p)));
    return g;
  }, [points]);
  return (
    <line geometry={geom}>
      <lineBasicMaterial color={color} opacity={opacity} transparent linewidth={1} />
    </line>
  );
}

// ─── Ground / Landscape ───────────────────────────────────────────────────────

function Landscape() {
  return (
    <group>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[60, 20]} />
        <meshStandardMaterial color="#2d5a1b" />
      </mesh>
      {/* Lighter path strip */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.95, 0]} receiveShadow>
        <planeGeometry args={[60, 3]} />
        <meshStandardMaterial color="#3d7a27" />
      </mesh>
      {/* Water / river surface in front of dam */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-11, -1.89, 0]} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#1d6fa4" transparent opacity={0.85} />
      </mesh>
      {/* Hills — background */}
      {[[-14, -1.5, -5], [-5, -1.6, -5], [4, -1.6, -5], [12, -1.5, -5]].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[3.5, 10, 6]} />
          <meshStandardMaterial color="#245218" />
        </mesh>
      ))}
      {[[-18, -1.7, -4], [0, -1.8, -5], [8, -1.6, -4], [16, -1.7, -4]].map(([x, y, z], i) => (
        <mesh key={i + 10} position={[x, y, z]}>
          <sphereGeometry args={[2.8, 8, 5]} />
          <meshStandardMaterial color="#1f4415" />
        </mesh>
      ))}
      {/* Water channel from dam to turbine */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-8, -1.92, 0]}>
        <planeGeometry args={[2, 1.5]} />
        <meshStandardMaterial color="#2196f3" transparent opacity={0.75} />
      </mesh>
    </group>
  );
}

// ─── Animated Water flow (reservoir behind dam) ───────────────────────────────

function ReservoirWater() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      // slight ripple via position
      ref.current.position.y = -0.08 + Math.sin(clock.getElapsedTime() * 1.2) * 0.03;
    }
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[-13.5, -0.1, 0]}>
      <planeGeometry args={[5, 6]} />
      <meshStandardMaterial color="#1e90ff" transparent opacity={0.8} emissive="#1e90ff" emissiveIntensity={0.1} />
    </mesh>
  );
}

// ─── Hydro Dam ────────────────────────────────────────────────────────────────

function Dam({ onClick, active }: { onClick: () => void; active: boolean }) {
  const ei = active ? 0.3 : 0;
  return (
    <group position={[-11, 0, 0]} onClick={onClick}>
      {/* Main dam wall */}
      <Box3 pos={[0, 0, 0]} size={[1.8, 4, 5]} color={active ? "#94a3b8" : "#64748b"} emissive="#38bdf8" emissiveIntensity={ei} />
      {/* Dam crest (top walkway) */}
      <Box3 pos={[0, 2.1, 0]} size={[2, 0.25, 5.2]} color="#475569" />
      {/* Water outflow gate */}
      <Box3 pos={[1.0, -0.8, 0]} size={[0.3, 0.7, 0.8]} color="#1d6fa4" emissive="#38bdf8" emissiveIntensity={0.4} />
      {/* Penstock tunnel opening */}
      <mesh position={[1.0, -0.8, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.35, 10]} />
        <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={0.5} />
      </mesh>
      {/* Dam buttresses */}
      {[-1.5, 0, 1.5].map((z, i) => (
        <Box3 key={i} pos={[-0.6, -0.5, z]} size={[0.6, 3, 0.35]} color="#374151" />
      ))}
      {/* Label */}
      <Text position={[0, -2.8, 2.8]} fontSize={0.42} color="#e2e8f0" anchorX="center" outlineWidth={0.03} outlineColor="#000">💧 Hydro Dam</Text>
    </group>
  );
}

// ─── Turbine ──────────────────────────────────────────────────────────────────

function Turbine({ onClick, active }: { onClick: () => void; active: boolean }) {
  const bladeRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (bladeRef.current) bladeRef.current.rotation.z = clock.getElapsedTime() * 3;
  });
  const ei = active ? 0.4 : 0;
  return (
    <group position={[-7, -0.3, 0]} onClick={onClick}>
      {/* Turbine housing (round) */}
      <mesh>
        <cylinderGeometry args={[1.0, 1.0, 1.4, 18]} />
        <meshStandardMaterial color={active ? "#22d3ee" : "#0891b2"} emissive="#06b6d4" emissiveIntensity={ei} />
      </mesh>
      {/* Turbine blades */}
      <group ref={bladeRef} position={[0, 0.1, 0.75]}>
        {[0, 60, 120, 180, 240, 300].map((angle) => (
          <group key={angle} rotation={[0, 0, (angle * Math.PI) / 180]}>
            <mesh position={[0, 0.52, 0]}>
              <boxGeometry args={[0.14, 0.75, 0.08]} />
              <meshStandardMaterial color="#bae6fd" emissive="#7dd3fc" emissiveIntensity={0.4} />
            </mesh>
          </group>
        ))}
        {/* Hub */}
        <mesh>
          <cylinderGeometry args={[0.16, 0.16, 0.1, 10]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.7} />
        </mesh>
      </group>
      {/* Intake pipe from dam */}
      <mesh position={[-1.5, -0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 1.8, 10]} />
        <meshStandardMaterial color="#1d4ed8" emissive="#3b82f6" emissiveIntensity={0.3} />
      </mesh>
      {/* Output shaft to generator */}
      <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 1.8, 8]} />
        <meshStandardMaterial color="#78716c" />
      </mesh>
      {/* Base */}
      <Box3 pos={[0, -1.2, 0]} size={[2.4, 0.4, 1.8]} color="#374151" />
      <Text position={[0, -2.0, 1.1]} fontSize={0.4} color="#e2e8f0" anchorX="center" outlineWidth={0.03} outlineColor="#000">⚙️ Water Turbine</Text>
    </group>
  );
}

// ─── Generator Building ───────────────────────────────────────────────────────

function Generator({ onClick, active }: { onClick: () => void; active: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ringRef.current) ringRef.current.rotation.y = clock.getElapsedTime() * 2.2;
  });
  const ei = active ? 0.45 : 0;
  return (
    <group position={[-3.5, -0.1, 0]} onClick={onClick}>
      {/* Building walls */}
      <Box3 pos={[0, 0.2, 0]} size={[2.2, 2.8, 1.8]} color={active ? "#a78bfa" : "#4c1d95"} emissive="#7c3aed" emissiveIntensity={ei} />
      {/* Roof */}
      <mesh position={[0, 1.7, 0]}>
        <coneGeometry args={[1.6, 0.7, 4]} />
        <meshStandardMaterial color="#1e1b4b" />
      </mesh>
      {/* Generator cylinder inside (visible through front) */}
      <mesh position={[0, 0.2, 0.85]}>
        <cylinderGeometry args={[0.55, 0.55, 1.5, 14]} />
        <meshStandardMaterial color="#6d28d9" emissive="#7c3aed" emissiveIntensity={0.6} />
      </mesh>
      {/* Spinning ring */}
      <mesh ref={ringRef} position={[0, 0.7, 0.85]}>
        <torusGeometry args={[0.45, 0.1, 8, 24]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.9} />
      </mesh>
      {/* Lightning bolt sign */}
      <Text position={[0, 1.0, 0.93]} fontSize={0.55} color="#fbbf24" anchorX="center">⚡</Text>
      {/* Base platform */}
      <Box3 pos={[0, -1.3, 0]} size={[2.6, 0.4, 2.2]} color="#374151" />
      <Text position={[0, -2.0, 1.2]} fontSize={0.4} color="#e2e8f0" anchorX="center" outlineWidth={0.03} outlineColor="#000">🔋 Generator</Text>
    </group>
  );
}

// ─── Step-up Transformer Station ──────────────────────────────────────────────

function Transformer({ onClick, active }: { onClick: () => void; active: boolean }) {
  const glowRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.5 + Math.sin(clock.getElapsedTime() * 2.5) * 0.3;
    }
  });
  const ei = active ? 0.4 : 0;
  return (
    <group position={[1, 0, 0]} onClick={onClick}>
      {/* Main transformer tank */}
      <Box3 pos={[0, 0, 0]} size={[1.6, 2.2, 1.2]} color={active ? "#fcd34d" : "#78350f"} emissive="#f59e0b" emissiveIntensity={ei} />
      {/* Fins / cooling radiators */}
      {[-0.55, 0.55].map((x, i) => (
        <Box3 key={i} pos={[x, 0, 0]} size={[0.12, 2.0, 1.1]} color="#92400e" />
      ))}
      {/* Top lid */}
      <Box3 pos={[0, 1.15, 0]} size={[1.8, 0.18, 1.3]} color="#451a03" />
      {/* Bushings / insulators on top */}
      {[-0.5, 0, 0.5].map((x, i) => (
        <group key={i} position={[x, 1.4, 0]}>
          <Cyl3 pos={[0, 0, 0]} args={[0.07, 0.07, 0.8, 8]} color="#d1d5db" />
          <mesh ref={i === 1 ? glowRef : undefined} position={[0, 0.48, 0]}>
            <sphereGeometry args={[0.13, 8, 8]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.7} />
          </mesh>
        </group>
      ))}
      {/* Small fence posts */}
      {[[-1.2, 0.3], [1.2, 0.3], [-1.2, -0.3], [1.2, -0.3]].map(([x, z], i) => (
        <Cyl3 key={i} pos={[x, -0.6, z]} args={[0.05, 0.05, 1.2, 6]} color="#6b7280" />
      ))}
      {/* Fence rails */}
      <Cable points={[[-1.2, 0, 0.3], [1.2, 0, 0.3], [1.2, 0, -0.3], [-1.2, 0, -0.3], [-1.2, 0, 0.3]]} color="#6b7280" />
      {/* Base pad */}
      <Box3 pos={[0, -1.35, 0]} size={[3, 0.3, 2]} color="#374151" />
      <Text position={[0, -2.1, 1.2]} fontSize={0.38} color="#e2e8f0" anchorX="center" outlineWidth={0.03} outlineColor="#000">🔌 Step-up Transformer</Text>
    </group>
  );
}

// ─── Transmission Tower ───────────────────────────────────────────────────────

function Tower({ pos, onClick, active }: { pos: [number, number, number]; onClick?: () => void; active: boolean }) {
  const ei = active ? 0.35 : 0;
  return (
    <group position={pos} onClick={onClick}>
      {/* Main vertical legs */}
      {[-0.35, 0.35].map((x, i) => (
        <group key={i}>
          <Cyl3 pos={[x * 0.5, -0.5, 0]} args={[0.05, 0.12, 3, 6]} color={active ? "#d1d5db" : "#9ca3af"} emissive="#94a3b8" ei={ei} />
        </group>
      ))}
      {/* Center mast */}
      <Cyl3 pos={[0, 0.5, 0]} args={[0.05, 0.05, 2, 6]} color={active ? "#d1d5db" : "#9ca3af"} emissive="#94a3b8" ei={ei} />
      {/* Cross arms */}
      <Box3 pos={[0, 0.5, 0]} size={[2.8, 0.08, 0.08]} color="#9ca3af" />
      <Box3 pos={[0, 1.1, 0]} size={[2.0, 0.07, 0.07]} color="#9ca3af" />
      <Box3 pos={[0, 1.5, 0]} size={[1.3, 0.06, 0.06]} color="#9ca3af"  />
      {/* Diagonal braces */}
      {[-1, 1].map((s, i) => (
        <mesh key={i} position={[s * 0.4, -0.2, 0]} rotation={[0, 0, s * 0.7]}>
          <boxGeometry args={[0.05, 1.2, 0.05]} />
          <meshStandardMaterial color="#78716c" />
        </mesh>
      ))}
      {/* Insulators / wire attachment points */}
      {[-1.2, 0, 1.2].map((x, i) => (
        <mesh key={i} position={[x, 0.5, 0]}>
          <sphereGeometry args={[0.09, 6, 6]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.7} />
        </mesh>
      ))}
      {/* Base */}
      <Box3 pos={[0, -2.1, 0]} size={[1.2, 0.3, 0.5]} color="#374151" />
    </group>
  );
}

function TransmissionLine({ onClick, active }: { onClick: () => void; active: boolean }) {
  return (
    <group onClick={onClick}>
      <Tower pos={[4, 0, 0]} active={active} />
      <Tower pos={[6.5, 0, 0]} active={active} />
      {/* High-voltage cables between towers */}
      {[-1.2, 0, 1.2].map((x, i) => (
        <Cable key={i} points={[
          [1.5, 1.2, x * 0.1], [4 + x * 0.001, 0.5, x * 0.1], [6.5 + x * 0.001, 0.5, x * 0.1], [7.8, 0.8, x * 0.1]
        ]} color="#fbbf24" opacity={0.9} />
      ))}
      <Text position={[5.2, -2.5, 0.4]} fontSize={0.38} color="#e2e8f0" anchorX="center" outlineWidth={0.03} outlineColor="#000">🗼 Transmission Tower</Text>
    </group>
  );
}

// ─── Distribution Transformer (on pole) ──────────────────────────────────────

function DistTransformer({ pos }: { pos: [number, number, number] }) {
  return (
    <group position={pos}>
      {/* Pole */}
      <Cyl3 pos={[0, -0.5, 0]} args={[0.07, 0.07, 3, 8]} color="#92400e" />
      {/* Small transformer box */}
      <Box3 pos={[0, 0.8, 0]} size={[0.5, 0.7, 0.4]} color="#78350f" />
      <Box3 pos={[0, 1.2, 0]} size={[0.55, 0.1, 0.45]} color="#451a03" />
      {/* Insulators */}
      {[-0.18, 0.18].map((x, i) => (
        <group key={i} position={[x, 1.4, 0]}>
          <Cyl3 pos={[0, 0, 0]} args={[0.04, 0.04, 0.35, 6]} color="#d1d5db" />
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.07, 5, 5]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.7} />
          </mesh>
        </group>
      ))}
      {/* Arm crosspiece */}
      <Box3 pos={[0, 1.0, 0]} size={[0.8, 0.06, 0.06]} color="#78350f" />
    </group>
  );
}

// ─── House ─────────────────────────────────────────────────────────────────────

function House({ onClick, active }: { onClick: () => void; active: boolean }) {
  const win1 = useRef<THREE.Mesh>(null);
  const win2 = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const pulse = 0.7 + Math.sin(clock.getElapsedTime() * 2) * 0.3;
    if (win1.current) (win1.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
    if (win2.current) (win2.current.material as THREE.MeshStandardMaterial).emissiveIntensity = pulse;
  });
  const ei = active ? 0.4 : 0;
  return (
    <group position={[10, -0.3, 0]} onClick={onClick}>
      {/* Main walls */}
      <Box3 pos={[0, 0.5, 0]} size={[2.4, 2.0, 2.0]} color={active ? "#34d399" : "#059669"} emissive="#10b981" emissiveIntensity={ei} />
      {/* Roof */}
      <mesh position={[0, 1.75, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.72, 1.1, 4]} />
        <meshStandardMaterial color="#b91c1c" />
      </mesh>
      {/* Chimney */}
      <Box3 pos={[0.6, 2.4, 0.3]} size={[0.3, 0.5, 0.3]} color="#78350f" />
      {/* Front door */}
      <Box3 pos={[0, -0.1, 1.02]} size={[0.45, 0.85, 0.08]} color="#78350f" />
      {/* Windows — glowing */}
      <mesh ref={win1} position={[0.55, 0.55, 1.02]}>
        <boxGeometry args={[0.45, 0.45, 0.08]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} />
      </mesh>
      <mesh ref={win2} position={[-0.55, 0.55, 1.02]}>
        <boxGeometry args={[0.45, 0.45, 0.08]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} />
      </mesh>
      {/* Window cross frames */}
      <Box3 pos={[0.55, 0.55, 1.07]} size={[0.45, 0.04, 0.04]} color="#374151" />
      <Box3 pos={[0.55, 0.55, 1.07]} size={[0.04, 0.45, 0.04]} color="#374151" />
      <Box3 pos={[-0.55, 0.55, 1.07]} size={[0.45, 0.04, 0.04]} color="#374151" />
      <Box3 pos={[-0.55, 0.55, 1.07]} size={[0.04, 0.45, 0.04]} color="#374151" />
      {/* Porch step */}
      <Box3 pos={[0, -0.65, 1.2]} size={[1, 0.18, 0.5]} color="#374151" />
      {/* Garden fence */}
      {[-1.3, -0.9, 0.9, 1.3].map((x, i) => (
        <Cyl3 key={i} pos={[x, -0.9, 1.4]} args={[0.04, 0.04, 0.6, 6]} color="#d97706" />
      ))}
      <Cable points={[[-1.3, -0.62, 1.4], [1.3, -0.62, 1.4]]} color="#d97706" />
      {/* Base */}
      <Box3 pos={[0, -1.2, 0]} size={[3.2, 0.3, 2.8]} color="#374151" />
      {/* Service wire from pole */}
      <Cable points={[[-2.0, 1.6, 0], [-1.5, 1.0, 0]]} color="#374151" opacity={0.8} />
      <Text position={[0, -2.0, 1.4]} fontSize={0.42} color="#e2e8f0" anchorX="center" outlineWidth={0.03} outlineColor="#000">🏠 Home</Text>
    </group>
  );
}

// ─── Main Scene ───────────────────────────────────────────────────────────────

function Scene({ onSelect, selectedId }: { onSelect: (id: string) => void; selectedId: string | null }) {
  return (
    <>
      {/* Sky */}
      <color attach="background" args={["#0c1e35"]} />
      <fog attach="fog" args={["#0c1e35", 30, 60]} />

      {/* Lighting */}
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 12, 8]} intensity={1.1} castShadow color="#fff5e0" />
      <directionalLight position={[-10, 8, -4]} intensity={0.3} color="#c7d2fe" />
      <pointLight position={[-11, 3, 0]} intensity={0.5} color="#38bdf8" distance={12} />
      <pointLight position={[10, 4, 0]} intensity={0.4} color="#34d399" distance={10} />

      {/* Landscape */}
      <Landscape />
      <ReservoirWater />

      {/* Components — flow from left to right */}
      <Dam onClick={() => onSelect("dam")} active={selectedId === "dam"} />
      <Turbine onClick={() => onSelect("turbine")} active={selectedId === "turbine"} />
      <Generator onClick={() => onSelect("generator")} active={selectedId === "generator"} />
      <Transformer onClick={() => onSelect("transformer")} active={selectedId === "transformer"} />
      <TransmissionLine onClick={() => onSelect("lines")} active={selectedId === "lines"} />
      <DistTransformer pos={[8.5, 0, 0]} />
      <House onClick={() => onSelect("house")} active={selectedId === "house"} />

      {/* Connection cables (low-voltage, ground level) */}
      <Cable points={[[-9.8, 0.3, 0], [-8.1, 0.3, 0]]} color="#3b82f6" opacity={0.9} />
      <Cable points={[[-6.0, 0.3, 0], [-5.4, 0.3, 0]]} color="#a78bfa" opacity={0.85} />
      <Cable points={[[-2.4, 1.1, 0], [-0.2, 1.1, 0]]} color="#fbbf24" opacity={0.9} />
      <Cable points={[[1.9, 1.5, 0], [3.2, 1.5, 0]]} color="#fbbf24" opacity={0.9} />
      <Cable points={[[8.5, 1.4, 0], [9.0, 1.0, 0]]} color="#9ca3af" opacity={0.8} />

      {/* Animated electricity particles */}
      <ElectricityFlow />

      <OrbitControls
        enableDamping
        dampingFactor={0.07}
        minDistance={10}
        maxDistance={32}
        maxPolarAngle={Math.PI / 1.9}
        target={[0, 0, 0]}
      />
    </>
  );
}

// ─── Page wrapper (UI stays identical) ────────────────────────────────────────

export default function ThreeDScene() {
  const { t } = useLanguage();
  const { setPage } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedObj = sceneObjects.find((o) => o.id === selectedId);
  const accent = selectedId ? accentColors[selectedId] : "#7c3aed";

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: "#0c1e35" }}>
      {/* ── Header ── */}
      <div
        className="shrink-0 flex items-center justify-between px-8"
        style={{ height: "64px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(12,30,53,0.97)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{
            background: "rgba(124,58,237,0.25)", color: "#a78bfa",
            fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
            padding: "0.25rem 0.75rem", borderRadius: "4px", textTransform: "uppercase",
          }}>
            Step 1 / 5
          </span>
          <h1 style={{ color: "#f1f5f9", fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>
            ⚡ {t("scene.title")}
          </h1>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => setPage("landing")}
            style={{
              padding: "0.5rem 1.25rem", borderRadius: "8px", fontSize: "0.9rem",
              fontWeight: 600, background: "rgba(255,255,255,0.07)", color: "#94a3b8",
              border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer",
            }}
          >
            ← {t("scene.back")}
          </button>
          <button
            onClick={() => setPage("age")}
            style={{
              padding: "0.5rem 1.5rem", borderRadius: "8px", fontSize: "0.9rem",
              fontWeight: 700, background: "linear-gradient(135deg, #7c3aed, #2563eb)",
              color: "#ffffff", border: "none", cursor: "pointer",
              boxShadow: "0 4px 14px rgba(124,58,237,0.4)",
            }}
          >
            {t("scene.next")} →
          </button>
        </div>
      </div>

      {/* ── 3D Canvas ── */}
      <div className="flex-1 relative min-h-0">
        <Canvas
          camera={{ position: [0, 5, 22], fov: 50 }}
          shadows
          style={{ width: "100%", height: "100%" }}
        >
          <Suspense fallback={null}>
            <Scene onSelect={(id) => setSelectedId(id === selectedId ? null : id)} selectedId={selectedId} />
          </Suspense>
        </Canvas>

        {/* ── Info panel ── */}
        <AnimatePresence>
          {selectedId && selectedObj && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.22 }}
              style={{
                position: "absolute", top: "16px", right: "16px",
                width: "310px", maxHeight: "calc(100% - 32px)",
                background: "rgba(12,30,53,0.97)",
                border: `1px solid ${accent}55`,
                borderRadius: "12px",
                display: "flex", flexDirection: "column",
                boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${accent}18`,
                overflow: "hidden",
              }}
            >
              {/* Panel header */}
              <div style={{
                padding: "13px 15px", display: "flex", alignItems: "center",
                justifyContent: "space-between",
                borderBottom: `1px solid ${accent}30`,
                background: `${accent}10`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "34px", height: "34px", borderRadius: "8px",
                    background: accent, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "1rem",
                  }}>
                    {t(selectedObj.emojiKey)}
                  </div>
                  <span style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "0.92rem" }}>
                    {t(selectedObj.nameKey)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  style={{
                    width: "26px", height: "26px", borderRadius: "6px",
                    background: "rgba(255,255,255,0.08)", color: "#94a3b8",
                    border: "none", cursor: "pointer", fontSize: "0.95rem", fontWeight: 700,
                  }}
                >×</button>
              </div>
              {/* Body */}
              <div style={{ padding: "13px 15px", overflowY: "auto", flex: 1 }}>
                <p style={{ color: "#cbd5e1", fontSize: "0.83rem", lineHeight: 1.65, marginBottom: "12px", margin: "0 0 12px" }}>
                  {t(selectedObj.infoKey)}
                </p>
                <div style={{
                  background: `${accent}12`, border: `1px solid ${accent}30`,
                  borderRadius: "8px", padding: "10px 12px",
                  display: "flex", gap: "8px", alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: "0.9rem", flexShrink: 0 }}>💡</span>
                  <p style={{ color: accent, fontSize: "0.8rem", fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
                    {t(selectedObj.factKey)}
                  </p>
                </div>
              </div>
              <div style={{ padding: "10px 15px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <button
                  onClick={() => setSelectedId(null)}
                  style={{
                    width: "100%", padding: "0.55rem", borderRadius: "7px",
                    background: accent, color: "#fff", fontWeight: 700,
                    fontSize: "0.85rem", border: "none", cursor: "pointer",
                  }}
                >
                  {t("scene.close")} ✓
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom bar ── */}
      <div
        className="shrink-0"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(12,30,53,0.97)",
          padding: "8px 24px",
          display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap",
        }}
      >
        <span style={{ color: "#475569", fontSize: "0.76rem", fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0 }}>
          {t("scene.instructions")}
        </span>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {sceneObjects.map((obj) => {
            const active = selectedId === obj.id;
            const ac = accentColors[obj.id];
            return (
              <button
                key={obj.id}
                onClick={() => setSelectedId(obj.id === selectedId ? null : obj.id)}
                style={{
                  padding: "4px 13px", borderRadius: "20px", fontSize: "0.78rem", fontWeight: 600,
                  border: active ? `1.5px solid ${ac}` : "1.5px solid rgba(255,255,255,0.1)",
                  background: active ? `${ac}20` : "rgba(255,255,255,0.04)",
                  color: active ? ac : "#64748b",
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                {chipEmojis[obj.id]} {t(obj.nameKey)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
