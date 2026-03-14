import { useRef, useState, Suspense, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/context/AppContext";

// ─── Scene object metadata ─────────────────────────────────────────────────────

interface SceneObject {
  id: string; nameKey: string; infoKey: string; factKey: string; emojiKey: string;
}
const sceneObjects: SceneObject[] = [
  { id: "dam",         nameKey: "obj.dam.name",         infoKey: "obj.dam.info",         factKey: "obj.dam.fact",         emojiKey: "obj.dam.emoji" },
  { id: "turbine",     nameKey: "obj.turbine.name",     infoKey: "obj.turbine.info",     factKey: "obj.turbine.fact",     emojiKey: "obj.turbine.emoji" },
  { id: "generator",   nameKey: "obj.generator.name",   infoKey: "obj.generator.info",   factKey: "obj.generator.fact",   emojiKey: "obj.generator.emoji" },
  { id: "transformer", nameKey: "obj.transformer.name", infoKey: "obj.transformer.info", factKey: "obj.transformer.fact", emojiKey: "obj.transformer.emoji" },
  { id: "lines",       nameKey: "obj.lines.name",       infoKey: "obj.lines.info",       factKey: "obj.lines.fact",       emojiKey: "obj.lines.emoji" },
  { id: "house",       nameKey: "obj.house.name",       infoKey: "obj.house.info",       factKey: "obj.house.fact",       emojiKey: "obj.house.emoji" },
];
const accentColors: Record<string, string> = {
  dam: "#38bdf8", turbine: "#3b82f6", generator: "#f97316",
  transformer: "#eab308", lines: "#64748b", house: "#22c55e",
};
const chipEmojis: Record<string, string> = {
  dam: "💧", turbine: "⚙️", generator: "🔋", transformer: "🔌", lines: "🗼", house: "🏠",
};

// ─── Primitive helpers ────────────────────────────────────────────────────────

function Box3({ pos, size, color, emissive = "#000", ei = 0, roughness = 0.6, metalness = 0, onClick }: {
  pos: [number,number,number]; size: [number,number,number]; color: string;
  emissive?: string; ei?: number; roughness?: number; metalness?: number; onClick?: () => void;
}) {
  return (
    <mesh position={pos} onClick={onClick} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={ei} roughness={roughness} metalness={metalness} />
    </mesh>
  );
}

function Cyl3({ pos, args, color, emissive = "#000", ei = 0, roughness = 0.6, metalness = 0, rot, onClick }: {
  pos: [number,number,number]; args: [number,number,number,number]; color: string;
  emissive?: string; ei?: number; roughness?: number; metalness?: number; rot?: [number,number,number]; onClick?: () => void;
}) {
  return (
    <mesh position={pos} rotation={rot ?? [0,0,0]} onClick={onClick} castShadow>
      <cylinderGeometry args={args} />
      <meshStandardMaterial color={color} emissive={emissive} emissiveIntensity={ei} roughness={roughness} metalness={metalness} />
    </mesh>
  );
}

// ─── Electricity particles ─────────────────────────────────────────────────────

type Seg = { from: THREE.Vector3; to: THREE.Vector3; len: number };
function buildSegs(wpts: [number,number,number][]): Seg[] {
  return wpts.slice(0,-1).map((p,i) => {
    const from = new THREE.Vector3(...p), to = new THREE.Vector3(...wpts[i+1]);
    return { from, to, len: from.distanceTo(to) };
  });
}

// Path follows exact wire connections between components
const mainPath: [number,number,number][] = [
  [-9.7, 0.35, 0],   // dam outflow start
  [-8.15, 0.35, 0],  // turbine entry
  [-5.95, 0.30, 0],  // turbine exit
  [-5.3,  0.30, 0],  // generator entry
  [-2.4,  1.35, 0],  // generator → transformer cable
  [-0.15, 1.35, 0],  // transformer entry
  [1.95,  1.50, 0],  // transformer exit cable
  [3.2,   1.50, 0],  // tower 1 entry
  [4.0,   0.52, 0],  // tower 1 arm
  [6.5,   0.52, 0],  // tower 2 arm
  [7.8,   0.92, 0],  // distribution transformer entry
  [8.5,   1.50, 0],  // distribution transformer exit
  [9.05,  1.10, 0],  // house entry
];

function ElectricParticle({ speed=4, offset=0, color="#fef08a" }: { speed?: number; offset?: number; color?: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const segs = useMemo(() => buildSegs(mainPath), []);
  const total = useMemo(() => segs.reduce((s,g) => s+g.len, 0), [segs]);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    let t = ((clock.getElapsedTime() * speed + offset) % total + total) % total;
    for (const seg of segs) {
      if (t <= seg.len) { ref.current.position.lerpVectors(seg.from, seg.to, t/seg.len); break; }
      t -= seg.len;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.11, 7, 7]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} roughness={0} />
    </mesh>
  );
}

function ElectricityFlow() {
  return <>{[0,2.8,5.6,8.4,11.2].map(off => <ElectricParticle key={off} speed={3.8} offset={off} />)}</>;
}

// ─── Cable lines ──────────────────────────────────────────────────────────────

function Cable({ points, color="#fbbf24", opacity=0.9 }: { points: [number,number,number][]; color?: string; opacity?: number }) {
  const geom = useMemo(() => new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(...p))), []);
  return <line geometry={geom}><lineBasicMaterial color={color} opacity={opacity} transparent /></line>;
}

// ─── Label with background panel ─────────────────────────────────────────────

function Label3D({ pos, text }: { pos: [number,number,number]; text: string }) {
  const bgW = text.length * 0.21 + 0.5;
  return (
    <group position={pos}>
      {/* Semi-transparent dark background pill */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[bgW, 0.52, 0.04]} />
        <meshStandardMaterial color="#0f172a" transparent opacity={0.72} roughness={1} />
      </mesh>
      <Text fontSize={0.38} color="#f8fafc" anchorX="center" anchorY="middle"
        outlineWidth={0.02} outlineColor="#000" maxWidth={6}>
        {text}
      </Text>
    </group>
  );
}

// ─── Trees ────────────────────────────────────────────────────────────────────

function Tree({ pos }: { pos: [number,number,number] }) {
  return (
    <group position={pos}>
      <Cyl3 pos={[0,-0.6,0]} args={[0.12,0.12,1.0,7]} color="#92400e" roughness={0.9} />
      <mesh position={[0,0.4,0]}>
        <coneGeometry args={[0.7,1.6,8]} />
        <meshStandardMaterial color="#16a34a" roughness={0.85} />
      </mesh>
      <mesh position={[0,1.1,0]}>
        <coneGeometry args={[0.48,1.2,8]} />
        <meshStandardMaterial color="#15803d" roughness={0.85} />
      </mesh>
    </group>
  );
}

// ─── Landscape ────────────────────────────────────────────────────────────────

function Landscape() {
  return (
    <group>
      {/* Narrow green ground strip — keeps focus on the system */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-2,0]} receiveShadow>
        <planeGeometry args={[50, 9]} />
        <meshStandardMaterial color="#22c55e" roughness={0.9} />
      </mesh>
      {/* Lighter path strip */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-1.97,0]}>
        <planeGeometry args={[50,2.4]} />
        <meshStandardMaterial color="#4ade80" roughness={0.9} />
      </mesh>
      {/* Wide sky-coloured base plane behind hills */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0,-2.1,-6]}>
        <planeGeometry args={[60, 14]} />
        <meshStandardMaterial color="#bfdbfe" roughness={1} />
      </mesh>
      {/* Water / river surface near dam */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[-11,-1.88,0]}>
        <planeGeometry args={[7,7]} />
        <meshStandardMaterial color="#60a5fa" transparent opacity={0.88} roughness={0.1} metalness={0.2} />
      </mesh>
      {/* Water channel dam→turbine */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[-8.5,-1.92,0]}>
        <planeGeometry args={[2.2,1.6]} />
        <meshStandardMaterial color="#93c5fd" transparent opacity={0.8} roughness={0.1} />
      </mesh>
      {/* Smaller distant hills — framing, not dominating */}
      {[[-14,-1.6,-6],[-5,-1.7,-6],[5,-1.7,-6],[14,-1.6,-6]].map(([x,y,z],i) => (
        <mesh key={i} position={[x,y,z]}>
          <sphereGeometry args={[2.8,10,6]} />
          <meshStandardMaterial color="#16a34a" roughness={0.9} />
        </mesh>
      ))}
      {[[-18,-1.7,-5],[0,-1.8,-6],[9,-1.7,-5],[18,-1.7,-5]].map(([x,y,z],i) => (
        <mesh key={i+10} position={[x,y,z]}>
          <sphereGeometry args={[2.2,8,5]} />
          <meshStandardMaterial color="#15803d" roughness={0.9} />
        </mesh>
      ))}
      {/* Trees — house side only, not near dam */}
      <Tree pos={[13.5,-1.0,-2]} />
      <Tree pos={[14.5,-1.0,2.5]} />
      <Tree pos={[12.0,-1.0,3]} />
      <Tree pos={[2.5,-1.0,-3.2]} />
      <Tree pos={[9.0,-1.0,-3]} />
    </group>
  );
}

// ─── Animated reservoir water ─────────────────────────────────────────────────

function ReservoirWater() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = -0.05 + Math.sin(clock.getElapsedTime()*1.3)*0.04;
  });
  return (
    <mesh ref={ref} rotation={[-Math.PI/2,0,0]} position={[-13.5,-0.0,0]}>
      <planeGeometry args={[5.5,7]} />
      <meshStandardMaterial color="#38bdf8" transparent opacity={0.85} roughness={0.05} metalness={0.3} emissive="#0ea5e9" emissiveIntensity={0.08} />
    </mesh>
  );
}

// ─── Hydro Dam ────────────────────────────────────────────────────────────────

function Dam({ onClick, active }: { onClick: () => void; active: boolean }) {
  const highlight = active ? "#38bdf8" : "#000";
  const hlI = active ? 0.25 : 0;
  return (
    <group position={[-11,0,0]} onClick={onClick}>
      {/* Main dam wall — light concrete */}
      <Box3 pos={[0,0,0]} size={[1.8,4,5]} color={active?"#cdd9e0":"#b0bec5"} emissive={highlight} ei={hlI} roughness={0.8} />
      {/* Top walkway */}
      <Box3 pos={[0,2.1,0]} size={[2,0.25,5.2]} color="#90a4ae" roughness={0.7} />
      {/* Railing along top */}
      {[-2, -1, 0, 1, 2].map((z,i) => (
        <Cyl3 key={i} pos={[0.7,2.45,z]} args={[0.04,0.04,0.5,6]} color="#78909c" roughness={0.5} />
      ))}
      <Cable points={[[-0.8,2.48,-2],[0.8,2.48,-2],[0.8,2.48,2],[-0.8,2.48,2]]} color="#546e7a" />
      {/* Blue water outflow */}
      <Box3 pos={[1.0,-0.8,0]} size={[0.3,0.7,0.8]} color="#3b82f6" emissive="#60a5fa" ei={0.5} roughness={0.2} />
      <mesh position={[1.0,-0.8,0]}>
        <cylinderGeometry args={[0.3,0.3,0.38,10]} />
        <meshStandardMaterial color="#2563eb" emissive="#3b82f6" emissiveIntensity={0.5} roughness={0.2} />
      </mesh>
      {/* Buttresses */}
      {[-1.5,0,1.5].map((z,i) => (
        <Box3 key={i} pos={[-0.55,-0.5,z]} size={[0.6,3,0.38]} color="#90a4ae" roughness={0.8} />
      ))}
      <Label3D pos={[0,-2.9,2.9]} text="💧 Hydro Dam" />
    </group>
  );
}

// ─── Water Turbine ────────────────────────────────────────────────────────────

function Turbine({ onClick, active }: { onClick: () => void; active: boolean }) {
  const bladeRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (bladeRef.current) bladeRef.current.rotation.z = clock.getElapsedTime()*3.2; });
  return (
    <group position={[-7,-0.3,0]} onClick={onClick}>
      {/* Steel-blue housing */}
      <mesh castShadow>
        <cylinderGeometry args={[1.0,1.0,1.4,18]} />
        <meshStandardMaterial color={active?"#60a5fa":"#1d4ed8"} emissive={active?"#3b82f6":"#000"} emissiveIntensity={active?0.35:0} roughness={0.35} metalness={0.5} />
      </mesh>
      {/* Shiny silver blades */}
      <group ref={bladeRef} position={[0,0.1,0.78]}>
        {[0,60,120,180,240,300].map(angle => (
          <group key={angle} rotation={[0,0,(angle*Math.PI)/180]}>
            <mesh position={[0,0.52,0]}>
              <boxGeometry args={[0.13,0.78,0.08]} />
              <meshStandardMaterial color="#e0f2fe" emissive="#bae6fd" emissiveIntensity={0.3} roughness={0.2} metalness={0.7} />
            </mesh>
          </group>
        ))}
        <mesh>
          <cylinderGeometry args={[0.18,0.18,0.12,10]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.8} roughness={0.2} metalness={0.5} />
        </mesh>
      </group>
      {/* Blue intake pipe */}
      <mesh position={[-1.55,-0.2,0]} rotation={[0,0,Math.PI/2]}>
        <cylinderGeometry args={[0.26,0.26,1.9,10]} />
        <meshStandardMaterial color="#2563eb" emissive="#3b82f6" emissiveIntensity={0.25} roughness={0.3} metalness={0.4} />
      </mesh>
      {/* Silver output shaft */}
      <mesh position={[1.55,0,0]} rotation={[0,0,Math.PI/2]}>
        <cylinderGeometry args={[0.13,0.13,1.9,8]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.7} />
      </mesh>
      <Box3 pos={[0,-1.2,0]} size={[2.4,0.4,1.8]} color="#94a3b8" roughness={0.7} metalness={0.3} />
      <Label3D pos={[0,-2.1,1.15]} text="⚙️ Water Turbine" />
    </group>
  );
}

// ─── Generator Building ───────────────────────────────────────────────────────

function Generator({ onClick, active }: { onClick: () => void; active: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => { if (ringRef.current) ringRef.current.rotation.y = clock.getElapsedTime()*2.5; });
  return (
    <group position={[-3.5,-0.1,0]} onClick={onClick}>
      {/* Orange building walls */}
      <Box3 pos={[0,0.2,0]} size={[2.2,2.8,1.8]} color={active?"#fb923c":"#f97316"} emissive="#f97316" ei={active?0.3:0} roughness={0.6} />
      {/* Dark orange roof */}
      <mesh position={[0,1.75,0]}>
        <coneGeometry args={[1.62,0.75,4]} />
        <meshStandardMaterial color="#c2410c" roughness={0.7} />
      </mesh>
      {/* Generator cylinder front face */}
      <mesh position={[0,0.2,0.88]}>
        <cylinderGeometry args={[0.57,0.57,1.5,14]} />
        <meshStandardMaterial color="#ea580c" emissive="#f97316" emissiveIntensity={0.5} roughness={0.35} metalness={0.4} />
      </mesh>
      {/* Spinning golden ring */}
      <mesh ref={ringRef} position={[0,0.7,0.88]}>
        <torusGeometry args={[0.47,0.1,8,26]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1.0} roughness={0.1} metalness={0.6} />
      </mesh>
      {/* Lightning bolt */}
      <Text position={[0,1.05,0.97]} fontSize={0.58} color="#fef08a" anchorX="center">⚡</Text>
      {/* Side windows */}
      <Box3 pos={[0.9,0.5,0]} size={[0.08,0.45,0.45]} color="#fef9c3" emissive="#fef08a" ei={0.5} roughness={0.1} />
      <Box3 pos={[-0.9,0.5,0]} size={[0.08,0.45,0.45]} color="#fef9c3" emissive="#fef08a" ei={0.5} roughness={0.1} />
      {/* Concrete base */}
      <Box3 pos={[0,-1.3,0]} size={[2.6,0.42,2.2]} color="#94a3b8" roughness={0.8} />
      <Label3D pos={[0,-2.1,1.25]} text="🔋 Electric Generator" />
    </group>
  );
}

// ─── Step-up Transformer Station ─────────────────────────────────────────────

function Transformer({ onClick, active }: { onClick: () => void; active: boolean }) {
  const glowRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (glowRef.current)
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6 + Math.sin(clock.getElapsedTime()*2.5)*0.35;
  });
  return (
    <group position={[1,0,0]} onClick={onClick}>
      {/* Bright yellow transformer tank */}
      <Box3 pos={[0,0,0]} size={[1.6,2.2,1.2]} color={active?"#fde047":"#eab308"} emissive="#fbbf24" ei={active?0.35:0.08} roughness={0.5} metalness={0.2} />
      {/* Dark yellow fins */}
      {[-0.55,0.55].map((x,i) => (
        <Box3 key={i} pos={[x,0,0]} size={[0.12,2.0,1.1]} color="#ca8a04" roughness={0.5} />
      ))}
      {/* Black details — top band */}
      <Box3 pos={[0,1.15,0]} size={[1.8,0.18,1.3]} color="#1c1917" roughness={0.5} />
      {/* Insulators */}
      {[-0.5,0,0.5].map((x,i) => (
        <group key={i} position={[x,1.42,0]}>
          <Cyl3 pos={[0,0,0]} args={[0.07,0.07,0.8,8]} color="#e2e8f0" roughness={0.4} metalness={0.3} />
          <mesh ref={i===1?glowRef:undefined} position={[0,0.48,0]}>
            <sphereGeometry args={[0.13,8,8]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.75} roughness={0.1} />
          </mesh>
        </group>
      ))}
      {/* Warning stripe */}
      <Box3 pos={[0,-0.6,0.62]} size={[1.4,0.22,0.08]} color="#dc2626" roughness={0.6} />
      <Box3 pos={[0,-0.6,0.62]} size={[0.18,0.22,0.09]} color="#1c1917" roughness={0.6} />
      {/* Fence posts */}
      {[[-1.2,0.3],[1.2,0.3],[-1.2,-0.3],[1.2,-0.3]].map(([x,z],i) => (
        <Cyl3 key={i} pos={[x,-0.55,z]} args={[0.055,0.055,1.3,6]} color="#64748b" roughness={0.6} />
      ))}
      <Cable points={[[-1.2,0.05,0.3],[1.2,0.05,0.3],[1.2,0.05,-0.3],[-1.2,0.05,-0.3],[-1.2,0.05,0.3]]} color="#64748b" />
      <Box3 pos={[0,-1.36,0]} size={[3,0.3,2]} color="#94a3b8" roughness={0.7} />
      <Label3D pos={[0,-2.15,1.2]} text="🔌 Transformer" />
    </group>
  );
}

// ─── Transmission Tower ───────────────────────────────────────────────────────

function Tower({ pos, active }: { pos: [number,number,number]; active: boolean }) {
  const sc = active ? "#f1f5f9" : "#cbd5e1";
  return (
    <group position={pos}>
      {/* Legs */}
      {[-0.4,0.4].map((x,i) => (
        <Cyl3 key={i} pos={[x,-0.8,0]} args={[0.055,0.12,3.2,6]} color={sc} roughness={0.3} metalness={0.6} />
      ))}
      {/* Mast top */}
      <Cyl3 pos={[0,0.6,0]} args={[0.05,0.05,2.1,6]} color={sc} roughness={0.3} metalness={0.6} />
      {/* Cross arms */}
      <Box3 pos={[0,0.5,0]} size={[2.9,0.09,0.09]} color="#e2e8f0" roughness={0.3} metalness={0.5} />
      <Box3 pos={[0,1.1,0]} size={[2.1,0.08,0.08]} color="#e2e8f0" roughness={0.3} metalness={0.5} />
      <Box3 pos={[0,1.55,0]} size={[1.4,0.07,0.07]} color="#e2e8f0" roughness={0.3} metalness={0.5} />
      {/* Diagonal braces */}
      {[-1,1].map((s,i) => (
        <mesh key={i} position={[s*0.38,-0.25,0]} rotation={[0,0,s*0.7]}>
          <boxGeometry args={[0.055,1.25,0.055]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.4} metalness={0.5} />
        </mesh>
      ))}
      {/* Insulator balls */}
      {[-1.2,0,1.2].map((x,i) => (
        <mesh key={i} position={[x,0.5,0]}>
          <sphereGeometry args={[0.1,7,7]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} roughness={0.1} />
        </mesh>
      ))}
      <Box3 pos={[0,-2.15,0]} size={[1.2,0.3,0.5]} color="#94a3b8" roughness={0.7} />
    </group>
  );
}

function TransmissionLine({ onClick, active }: { onClick: () => void; active: boolean }) {
  return (
    <group onClick={onClick}>
      <Tower pos={[4,0,0]} active={active} />
      <Tower pos={[6.5,0,0]} active={active} />
      {/* Glowing yellow cables */}
      {[-1.2,0,1.2].map((x,i) => (
        <Cable key={i} points={[[1.6,1.4,x*0.05],[4,0.52,x*0.05],[6.5,0.52,x*0.05],[7.8,0.92,x*0.05]]} color="#fbbf24" opacity={0.95} />
      ))}
      <Label3D pos={[5.2,-2.6,0.45]} text="🗼 Transmission Tower" />
    </group>
  );
}

// ─── Distribution Transformer ─────────────────────────────────────────────────

function DistTransformer({ pos }: { pos: [number,number,number] }) {
  return (
    <group position={pos}>
      <Cyl3 pos={[0,-0.5,0]} args={[0.08,0.08,3.2,8]} color="#92400e" roughness={0.9} />
      <Box3 pos={[0,0.85,0]} size={[0.52,0.75,0.42]} color="#eab308" roughness={0.5} metalness={0.2} />
      <Box3 pos={[0,1.26,0]} size={[0.58,0.12,0.46]} color="#ca8a04" roughness={0.5} />
      {[-0.19,0.19].map((x,i) => (
        <group key={i} position={[x,1.48,0]}>
          <Cyl3 pos={[0,0,0]} args={[0.045,0.045,0.38,6]} color="#e2e8f0" roughness={0.4} metalness={0.3} />
          <mesh position={[0,0.22,0]}>
            <sphereGeometry args={[0.078,5,5]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} />
          </mesh>
        </group>
      ))}
      <Box3 pos={[0,1.05,0]} size={[0.85,0.065,0.065]} color="#92400e" roughness={0.8} />
      <Label3D pos={[0,-2.0,0.5]} text="🔌 Dist. Transformer" />
    </group>
  );
}

// ─── House ─────────────────────────────────────────────────────────────────────

function House({ onClick, active }: { onClick: () => void; active: boolean }) {
  const w1 = useRef<THREE.Mesh>(null);
  const w2 = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const p = 0.75 + Math.sin(clock.getElapsedTime()*2.2)*0.25;
    if (w1.current) (w1.current.material as THREE.MeshStandardMaterial).emissiveIntensity = p;
    if (w2.current) (w2.current.material as THREE.MeshStandardMaterial).emissiveIntensity = p;
  });
  return (
    <group position={[10,-0.3,0]} onClick={onClick}>
      {/* Cream/pastel walls */}
      <Box3 pos={[0,0.5,0]} size={[2.4,2.0,2.0]} color={active?"#fef9c3":"#fef3c7"} emissive="#fef08a" ei={active?0.2:0} roughness={0.75} />
      {/* Bright red roof */}
      <mesh position={[0,1.75,0]} rotation={[0,Math.PI/4,0]}>
        <coneGeometry args={[1.72,1.12,4]} />
        <meshStandardMaterial color="#ef4444" roughness={0.65} />
      </mesh>
      {/* Chimney */}
      <Box3 pos={[0.62,2.42,0.3]} size={[0.3,0.52,0.3]} color="#d97706" roughness={0.8} />
      {/* Brown door */}
      <Box3 pos={[0,-0.08,1.03]} size={[0.46,0.88,0.08]} color="#92400e" roughness={0.8} />
      {/* Glowing windows */}
      <mesh ref={w1} position={[0.56,0.55,1.03]}>
        <boxGeometry args={[0.46,0.46,0.08]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.9} roughness={0.05} />
      </mesh>
      <mesh ref={w2} position={[-0.56,0.55,1.03]}>
        <boxGeometry args={[0.46,0.46,0.08]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.9} roughness={0.05} />
      </mesh>
      {/* Window cross frames */}
      {[[0.56,0.55,1.08],[-0.56,0.55,1.08]].map(([px,py,pz],j) => (
        <group key={j}>
          <Box3 pos={[px,py,pz]} size={[0.46,0.04,0.04]} color="#374151" />
          <Box3 pos={[px,py,pz]} size={[0.04,0.46,0.04]} color="#374151" />
        </group>
      ))}
      {/* Porch */}
      <Box3 pos={[0,-0.65,1.22]} size={[1.0,0.18,0.52]} color="#d97706" roughness={0.7} />
      {/* Garden fence */}
      {[-1.3,-0.9,0.9,1.3].map((x,i) => (
        <Cyl3 key={i} pos={[x,-0.9,1.42]} args={[0.045,0.045,0.62,6]} color="#f59e0b" roughness={0.7} />
      ))}
      <Cable points={[[-1.3,-0.6,1.42],[1.3,-0.6,1.42]]} color="#f59e0b" />
      {/* Base */}
      <Box3 pos={[0,-1.2,0]} size={[3.2,0.3,2.8]} color="#94a3b8" roughness={0.8} />
      {/* Service wire */}
      <Cable points={[[-2.1,1.65,0],[-1.55,1.1,0]]} color="#475569" opacity={0.9} />
      <Label3D pos={[0,-2.05,1.45]} text="🏠 Home" />
    </group>
  );
}

// ─── Main Scene ───────────────────────────────────────────────────────────────

function Scene({ onSelect, selectedId }: { onSelect: (id: string) => void; selectedId: string | null }) {
  return (
    <>
      {/* Bright sky blue background */}
      <color attach="background" args={["#87ceeb"]} />
      {/* Light blue horizon fog */}
      <fog attach="fog" args={["#bfdbfe", 28, 55]} />

      {/* Bright daylight lighting */}
      <ambientLight intensity={1.4} color="#fff8f0" />
      <directionalLight position={[8, 16, 10]} intensity={1.8} castShadow color="#fffbeb"
        shadow-mapSize={[1024,1024]} shadow-camera-far={50} shadow-camera-left={-20} shadow-camera-right={20} shadow-camera-top={12} shadow-camera-bottom={-12} />
      <directionalLight position={[-12, 8, 6]} intensity={0.5} color="#dbeafe" />
      <directionalLight position={[0, 4, 14]} intensity={0.4} color="#f0fdf4" />
      <pointLight position={[-11,5,2]} intensity={0.6} color="#bae6fd" distance={14} />
      <pointLight position={[10,5,2]} intensity={0.5} color="#bbf7d0" distance={12} />

      {/* Landscape */}
      <Landscape />
      <ReservoirWater />

      {/* Components */}
      <Dam        onClick={() => onSelect("dam")}         active={selectedId==="dam"} />
      <Turbine    onClick={() => onSelect("turbine")}     active={selectedId==="turbine"} />
      <Generator  onClick={() => onSelect("generator")}  active={selectedId==="generator"} />
      <Transformer onClick={() => onSelect("transformer")} active={selectedId==="transformer"} />
      <TransmissionLine onClick={() => onSelect("lines")} active={selectedId==="lines"} />
      <DistTransformer pos={[8.5,0,0]} />
      <House      onClick={() => onSelect("house")}      active={selectedId==="house"} />

      {/* Ground-level cables */}
      <Cable points={[[-9.7,0.35,0],[-8.15,0.35,0]]} color="#60a5fa" opacity={0.9} />
      <Cable points={[[-5.95,0.3,0],[-5.3,0.3,0]]}   color="#93c5fd" opacity={0.85} />
      <Cable points={[[-2.4,1.35,0],[-0.15,1.35,0]]} color="#fbbf24" opacity={0.92} />
      <Cable points={[[1.95,1.5,0],[3.2,1.5,0]]}     color="#fbbf24" opacity={0.92} />
      <Cable points={[[8.5,1.5,0],[9.05,1.1,0]]}     color="#94a3b8" opacity={0.9} />

      {/* Animated electric flow */}
      <ElectricityFlow />

      <OrbitControls enableDamping dampingFactor={0.07} minDistance={10} maxDistance={32}
        maxPolarAngle={Math.PI/1.9} target={[0,0,0]} />
    </>
  );
}

// ─── Page wrapper (UI layout unchanged) ──────────────────────────────────────

export default function ThreeDScene() {
  const { t } = useLanguage();
  const { setPage } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedObj = sceneObjects.find(o => o.id === selectedId);
  const accent = selectedId ? accentColors[selectedId] : "#7c3aed";

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: "#87ceeb" }}>

      {/* ── Header ── */}
      <div className="shrink-0 flex items-center justify-between px-8"
        style={{ height:"64px", borderBottom:"1px solid rgba(0,0,0,0.08)", background:"rgba(255,255,255,0.92)", backdropFilter:"blur(8px)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"12px" }}>
          <span style={{ background:"rgba(124,58,237,0.12)", color:"#7c3aed", fontSize:"0.72rem", fontWeight:700, letterSpacing:"0.1em", padding:"0.25rem 0.75rem", borderRadius:"4px", textTransform:"uppercase" }}>
            Step 1 / 5
          </span>
          <h1 style={{ color:"#1e293b", fontSize:"1.1rem", fontWeight:700, margin:0 }}>⚡ {t("scene.title")}</h1>
        </div>
        <div style={{ display:"flex", gap:"8px" }}>
          <button onClick={() => setPage("landing")}
            style={{ padding:"0.5rem 1.25rem", borderRadius:"8px", fontSize:"0.9rem", fontWeight:600, background:"rgba(0,0,0,0.05)", color:"#475569", border:"1px solid rgba(0,0,0,0.1)", cursor:"pointer" }}>
            ← {t("scene.back")}
          </button>
          <button onClick={() => setPage("age")}
            style={{ padding:"0.5rem 1.5rem", borderRadius:"8px", fontSize:"0.9rem", fontWeight:700, background:"linear-gradient(135deg,#7c3aed,#2563eb)", color:"#fff", border:"none", cursor:"pointer", boxShadow:"0 4px 14px rgba(124,58,237,0.35)" }}>
            {t("scene.next")} →
          </button>
        </div>
      </div>

      {/* ── 3D Canvas ── */}
      <div className="flex-1 relative min-h-0">
        <Canvas camera={{ position:[0,5,22], fov:50 }} shadows style={{ width:"100%", height:"100%" }}>
          <Suspense fallback={null}>
            <Scene onSelect={id => setSelectedId(id===selectedId?null:id)} selectedId={selectedId} />
          </Suspense>
        </Canvas>

        {/* ── Info panel ── */}
        <AnimatePresence>
          {selectedId && selectedObj && (
            <motion.div initial={{ opacity:0, x:24 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:24 }}
              transition={{ duration:0.22 }}
              style={{ position:"absolute", top:"16px", right:"16px", width:"310px", maxHeight:"calc(100% - 32px)",
                background:"rgba(255,255,255,0.97)", border:`1px solid ${accent}40`,
                borderRadius:"12px", display:"flex", flexDirection:"column",
                boxShadow:`0 8px 32px rgba(0,0,0,0.15), 0 0 0 1px ${accent}15`, overflow:"hidden" }}>
              <div style={{ padding:"13px 15px", display:"flex", alignItems:"center", justifyContent:"space-between",
                borderBottom:`1px solid ${accent}25`, background:`${accent}10` }}>
                <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                  <div style={{ width:"34px", height:"34px", borderRadius:"8px", background:accent,
                    display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1rem" }}>
                    {t(selectedObj.emojiKey)}
                  </div>
                  <span style={{ color:"#1e293b", fontWeight:700, fontSize:"0.92rem" }}>{t(selectedObj.nameKey)}</span>
                </div>
                <button onClick={() => setSelectedId(null)}
                  style={{ width:"26px", height:"26px", borderRadius:"6px", background:"rgba(0,0,0,0.06)",
                    color:"#64748b", border:"none", cursor:"pointer", fontSize:"0.95rem", fontWeight:700 }}>×</button>
              </div>
              <div style={{ padding:"13px 15px", overflowY:"auto", flex:1 }}>
                <p style={{ color:"#334155", fontSize:"0.83rem", lineHeight:1.65, margin:"0 0 12px" }}>{t(selectedObj.infoKey)}</p>
                <div style={{ background:`${accent}12`, border:`1px solid ${accent}30`, borderRadius:"8px",
                  padding:"10px 12px", display:"flex", gap:"8px", alignItems:"flex-start" }}>
                  <span style={{ fontSize:"0.9rem", flexShrink:0 }}>💡</span>
                  <p style={{ color:accent, fontSize:"0.8rem", fontWeight:600, lineHeight:1.5, margin:0 }}>{t(selectedObj.factKey)}</p>
                </div>
              </div>
              <div style={{ padding:"10px 15px", borderTop:"1px solid rgba(0,0,0,0.06)" }}>
                <button onClick={() => setSelectedId(null)}
                  style={{ width:"100%", padding:"0.55rem", borderRadius:"7px", background:accent,
                    color:"#fff", fontWeight:700, fontSize:"0.85rem", border:"none", cursor:"pointer" }}>
                  {t("scene.close")} ✓
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom bar ── */}
      <div className="shrink-0" style={{ borderTop:"1px solid rgba(0,0,0,0.1)", background:"rgba(255,255,255,0.95)",
        backdropFilter:"blur(8px)", padding:"6px 20px 8px", display:"flex", flexDirection:"column", gap:"6px" }}>
        {/* Instruction strip */}
        <div style={{ display:"flex", justifyContent:"center", alignItems:"center",
          background:"rgba(241,245,249,0.9)", borderRadius:"8px", padding:"5px 16px", gap:"16px", flexWrap:"wrap" }}>
          <span style={{ color:"#0f172a", fontSize:"0.82rem", fontWeight:700, letterSpacing:"0.01em" }}>
            👆 Click on any component to learn more
          </span>
          <span style={{ color:"#475569", fontSize:"0.79rem", fontWeight:500 }}>
            🖱️ Drag to rotate &nbsp;•&nbsp; Scroll to zoom
          </span>
        </div>
        {/* Component chips */}
        <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", justifyContent:"center" }}>
          {sceneObjects.map(obj => {
            const isActive = selectedId===obj.id;
            const ac = accentColors[obj.id];
            return (
              <button key={obj.id} onClick={() => setSelectedId(obj.id===selectedId?null:obj.id)}
                style={{ padding:"4px 13px", borderRadius:"20px", fontSize:"0.78rem", fontWeight:600,
                  border: isActive?`1.5px solid ${ac}`:"1.5px solid rgba(0,0,0,0.14)",
                  background: isActive?`${ac}18`:"rgba(0,0,0,0.04)",
                  color: isActive?ac:"#374151", cursor:"pointer", transition:"all 0.15s" }}>
                {chipEmojis[obj.id]} {t(obj.nameKey)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
