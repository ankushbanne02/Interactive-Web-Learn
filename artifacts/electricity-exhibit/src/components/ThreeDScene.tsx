import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Box, Cylinder, Cone } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/context/AppContext";

interface SceneObject {
  id: string;
  nameKey: string;
  infoKey: string;
  factKey: string;
  emojiKey: string;
}

const sceneObjects: SceneObject[] = [
  { id: "dam", nameKey: "obj.dam.name", infoKey: "obj.dam.info", factKey: "obj.dam.fact", emojiKey: "obj.dam.emoji" },
  { id: "turbine", nameKey: "obj.turbine.name", infoKey: "obj.turbine.info", factKey: "obj.turbine.fact", emojiKey: "obj.turbine.emoji" },
  { id: "generator", nameKey: "obj.generator.name", infoKey: "obj.generator.info", factKey: "obj.generator.fact", emojiKey: "obj.generator.emoji" },
  { id: "transformer", nameKey: "obj.transformer.name", infoKey: "obj.transformer.info", factKey: "obj.transformer.fact", emojiKey: "obj.transformer.emoji" },
  { id: "lines", nameKey: "obj.lines.name", infoKey: "obj.lines.info", factKey: "obj.lines.fact", emojiKey: "obj.lines.emoji" },
  { id: "house", nameKey: "obj.house.name", infoKey: "obj.house.info", factKey: "obj.house.fact", emojiKey: "obj.house.emoji" },
];

const accentColors: Record<string, string> = {
  dam: "#0ea5e9",
  turbine: "#06b6d4",
  generator: "#7c3aed",
  transformer: "#f59e0b",
  lines: "#64748b",
  house: "#10b981",
};

const chipEmojis: Record<string, string> = {
  dam: "💧", turbine: "⚙️", generator: "🔋", transformer: "🔌", lines: "🗼", house: "🏠",
};

// ─── 3D components ──────────────────────────────────────────────

function Dam({ onClick, hovered }: { onClick: () => void; hovered: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = Math.sin(clock.getElapsedTime() * 0.6) * 0.05;
  });
  return (
    <group ref={ref} position={[-6, 0, 0]} onClick={onClick}>
      <Box args={[2, 3, 1.5]} castShadow>
        <meshStandardMaterial color={hovered ? "#94a3b8" : "#475569"} emissive={hovered ? "#0ea5e9" : "#000"} emissiveIntensity={hovered ? 0.3 : 0} />
      </Box>
      <Box args={[2, 0.4, 1.5]} position={[0, 1.7, 0]}>
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.85} emissive="#0ea5e9" emissiveIntensity={0.35} />
      </Box>
      <Box args={[0.3, 0.6, 1.52]} position={[0, -0.7, 0]}>
        <meshStandardMaterial color="#fbbf24" />
      </Box>
      <Text position={[0, -2.1, 0.85]} fontSize={0.38} color="#ffffff" anchorX="center" outlineWidth={0.025} outlineColor="#000000">
        💧 DAM
      </Text>
    </group>
  );
}

function Turbine({ onClick, hovered }: { onClick: () => void; hovered: boolean }) {
  const bladeRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (bladeRef.current) bladeRef.current.rotation.z = clock.getElapsedTime() * 2.8;
  });
  return (
    <group position={[-2.5, 0, 0]} onClick={onClick}>
      <Cylinder args={[0.6, 0.6, 1.4, 20]}>
        <meshStandardMaterial color={hovered ? "#22d3ee" : "#0891b2"} emissive={hovered ? "#0ea5e9" : "#000"} emissiveIntensity={hovered ? 0.4 : 0} />
      </Cylinder>
      <group ref={bladeRef} position={[0, 0.2, 0]}>
        {[0, 120, 240].map((angle) => (
          <group key={angle} rotation={[0, 0, (angle * Math.PI) / 180]}>
            <Box args={[0.16, 0.9, 0.09]} position={[0, 0.58, 0]}>
              <meshStandardMaterial color="#e0f2fe" emissive="#bae6fd" emissiveIntensity={0.35} />
            </Box>
          </group>
        ))}
        <mesh>
          <sphereGeometry args={[0.15, 12, 12]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.6} />
        </mesh>
      </group>
      <Text position={[0, -1.5, 0.75]} fontSize={0.34} color="#ffffff" anchorX="center" outlineWidth={0.025} outlineColor="#000000">
        ⚙️ TURBINE
      </Text>
    </group>
  );
}

function Generator({ onClick, hovered }: { onClick: () => void; hovered: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ringRef.current) ringRef.current.rotation.y = clock.getElapsedTime() * 2;
  });
  return (
    <group position={[1, 0, 0]} onClick={onClick}>
      <Box args={[1.6, 1.3, 1.3]}>
        <meshStandardMaterial color={hovered ? "#a78bfa" : "#5b21b6"} emissive={hovered ? "#5b21b6" : "#000"} emissiveIntensity={hovered ? 0.45 : 0} />
      </Box>
      <Box args={[1.65, 0.18, 1.35]} position={[0, 0.74, 0]}>
        <meshStandardMaterial color="#3b0764" />
      </Box>
      <mesh ref={ringRef} position={[0, 0.95, 0]}>
        <torusGeometry args={[0.4, 0.1, 8, 28]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.75} />
      </mesh>
      <Text position={[0, -1.3, 0.75]} fontSize={0.32} color="#ffffff" anchorX="center" outlineWidth={0.025} outlineColor="#000000">
        🔋 GENERATOR
      </Text>
    </group>
  );
}

function Transformer({ onClick, hovered }: { onClick: () => void; hovered: boolean }) {
  const glowRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (glowRef.current) {
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.4 + Math.sin(clock.getElapsedTime() * 2.2) * 0.25;
    }
  });
  return (
    <group position={[4, 0, 0]} onClick={onClick}>
      <Box args={[1.4, 1.7, 1.1]}>
        <meshStandardMaterial color={hovered ? "#fcd34d" : "#92400e"} emissive={hovered ? "#78350f" : "#000"} emissiveIntensity={hovered ? 0.4 : 0} />
      </Box>
      <Box args={[1.45, 0.12, 1.15]} position={[0, 0.91, 0]}>
        <meshStandardMaterial color="#78350f" />
      </Box>
      {[-0.38, 0, 0.38].map((x, i) => (
        <group key={i} position={[x, 1.2, 0]}>
          <Cylinder args={[0.06, 0.06, 0.75, 8]}>
            <meshStandardMaterial color="#9ca3af" />
          </Cylinder>
          <mesh ref={i === 1 ? glowRef : undefined} position={[0, 0.44, 0]}>
            <sphereGeometry args={[0.11, 8, 8]} />
            <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.65} />
          </mesh>
        </group>
      ))}
      <Text position={[0, -1.5, 0.65]} fontSize={0.3} color="#ffffff" anchorX="center" outlineWidth={0.025} outlineColor="#000000">
        🔌 TRANSFORMER
      </Text>
    </group>
  );
}

function Lines({ onClick, hovered }: { onClick: () => void; hovered: boolean }) {
  return (
    <group position={[4, 2.2, 0]} onClick={onClick}>
      {[-1.6, 0, 1.6].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <Cylinder args={[0.05, 0.08, 2.8, 6]} position={[0, -1.4, 0]}>
            <meshStandardMaterial color="#78716c" />
          </Cylinder>
          <Box args={[0.85, 0.06, 0.06]} position={[0, -0.25, 0]}>
            <meshStandardMaterial color={hovered ? "#d1d5db" : "#9ca3af"} emissive={hovered ? "#6b7280" : "#000"} emissiveIntensity={hovered ? 0.35 : 0} />
          </Box>
          <Box args={[0.6, 0.06, 0.06]} position={[0, -0.5, 0]}>
            <meshStandardMaterial color={hovered ? "#d1d5db" : "#9ca3af"} emissive={hovered ? "#6b7280" : "#000"} emissiveIntensity={hovered ? 0.35 : 0} />
          </Box>
          {[-0.25, 0.25].map((cx) => (
            <mesh key={cx} position={[cx, -0.32, 0]}>
              <sphereGeometry args={[0.06, 6, 6]} />
              <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.55} />
            </mesh>
          ))}
        </group>
      ))}
      <Text position={[0, -2.8, 0]} fontSize={0.32} color="#ffffff" anchorX="center" outlineWidth={0.025} outlineColor="#000000">
        🗼 POWER LINES
      </Text>
    </group>
  );
}

function House({ onClick, hovered }: { onClick: () => void; hovered: boolean }) {
  const windowRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (windowRef.current) {
      (windowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.7 + Math.sin(clock.getElapsedTime() * 1.8) * 0.3;
    }
  });
  return (
    <group position={[8, 0, 0]} onClick={onClick}>
      <Box args={[1.8, 1.5, 1.4]}>
        <meshStandardMaterial color={hovered ? "#34d399" : "#065f46"} emissive={hovered ? "#065f46" : "#000"} emissiveIntensity={hovered ? 0.4 : 0} />
      </Box>
      <Cone args={[1.28, 1, 4]} position={[0, 1.25, 0]} rotation={[0, Math.PI / 4, 0]}>
        <meshStandardMaterial color="#b91c1c" />
      </Cone>
      <mesh ref={windowRef} position={[0.28, 0.15, 0.72]}>
        <boxGeometry args={[0.35, 0.35, 0.06]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} />
      </mesh>
      <Box args={[0.35, 0.35, 0.06]} position={[-0.32, 0.15, 0.72]}>
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.75} />
      </Box>
      <Box args={[0.32, 0.6, 0.06]} position={[0, -0.45, 0.72]}>
        <meshStandardMaterial color="#92400e" />
      </Box>
      <Text position={[0, -1.35, 0.8]} fontSize={0.36} color="#ffffff" anchorX="center" outlineWidth={0.025} outlineColor="#000000">
        🏠 HOME
      </Text>
    </group>
  );
}

function WireLine({ from, to, color = "#fbbf24" }: { from: [number, number, number]; to: [number, number, number]; color?: string }) {
  const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)];
  const geom = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <line geometry={geom}>
      <lineBasicMaterial color={color} opacity={0.75} transparent />
    </line>
  );
}

function Scene({ onSelect, hoveredId }: {
  onSelect: (id: string) => void;
  hoveredId: string | null;
}) {
  return (
    <>
      <color attach="background" args={["#0f172a"]} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[6, 10, 6]} intensity={1.3} castShadow color="#ffffff" />
      <pointLight position={[-10, 8, 5]} intensity={0.5} color="#bfdbfe" />
      <pointLight position={[12, 5, 5]} intensity={0.4} color="#d1fae5" />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1, -2, 0]} receiveShadow>
        <planeGeometry args={[40, 16]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      {/* Grid overlay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1, -1.98, 0]}>
        <planeGeometry args={[40, 16]} />
        <meshStandardMaterial color="#334155" wireframe opacity={0.2} transparent />
      </mesh>

      {/* Connection wires */}
      <WireLine from={[-4.9, 0.5, 0]} to={[-3.1, 0, 0]} />
      <WireLine from={[-1.9, 0, 0]} to={[-0.2, 0, 0]} />
      <WireLine from={[2.8, 0, 0]} to={[3.3, 0, 0]} />
      <WireLine from={[4, 0.9, 0]} to={[4, 1.9, 0]} />
      <WireLine from={[5.4, 0, 0]} to={[6.2, 0, 0]} />

      <Dam onClick={() => onSelect("dam")} hovered={hoveredId === "dam"} />
      <Turbine onClick={() => onSelect("turbine")} hovered={hoveredId === "turbine"} />
      <Generator onClick={() => onSelect("generator")} hovered={hoveredId === "generator"} />
      <Transformer onClick={() => onSelect("transformer")} hovered={hoveredId === "transformer"} />
      <Lines onClick={() => onSelect("lines")} hovered={hoveredId === "lines"} />
      <House onClick={() => onSelect("house")} hovered={hoveredId === "house"} />

      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        minDistance={8}
        maxDistance={26}
        maxPolarAngle={Math.PI / 1.85}
        target={[1, 0, 0]}
      />
    </>
  );
}

export default function ThreeDScene() {
  const { t } = useLanguage();
  const { setPage } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId] = useState<string | null>(null);

  const selectedObj = sceneObjects.find((o) => o.id === selectedId);
  const accent = selectedId ? accentColors[selectedId] : "#7c3aed";

  return (
    <div className="w-full h-full flex flex-col overflow-hidden" style={{ background: "#0f172a" }}>
      {/* Header */}
      <div
        className="shrink-0 flex items-center justify-between px-8"
        style={{ height: "64px", borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(15,23,42,0.95)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{
            background: "rgba(124,58,237,0.25)", color: "#a78bfa",
            fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
            padding: "0.25rem 0.75rem", borderRadius: "4px", textTransform: "uppercase"
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
              border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer"
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
              boxShadow: "0 4px 14px rgba(124,58,237,0.4)"
            }}
          >
            {t("scene.next")} →
          </button>
        </div>
      </div>

      {/* Canvas — fills all remaining space */}
      <div className="flex-1 relative min-h-0">
        <Canvas camera={{ position: [1, 4, 18], fov: 46 }} shadows style={{ width: "100%", height: "100%" }}>
          <Suspense fallback={null}>
            <Scene onSelect={setSelectedId} hoveredId={hoveredId} />
          </Suspense>
        </Canvas>

        {/* Info panel — right side overlay */}
        <AnimatePresence>
          {selectedId && selectedObj && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              style={{
                position: "absolute", top: "16px", right: "16px",
                width: "320px", maxHeight: "calc(100% - 32px)",
                background: "rgba(15,23,42,0.97)",
                border: `1px solid ${accent}50`,
                borderRadius: "12px",
                display: "flex", flexDirection: "column",
                boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${accent}20`,
                overflow: "hidden",
              }}
            >
              {/* Panel header */}
              <div style={{
                padding: "14px 16px", display: "flex", alignItems: "center",
                justifyContent: "space-between", gap: "10px",
                borderBottom: `1px solid ${accent}30`,
                background: `${accent}12`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "36px", height: "36px", borderRadius: "8px",
                    background: accent, display: "flex", alignItems: "center",
                    justifyContent: "center", fontSize: "1.1rem",
                  }}>
                    {t(selectedObj.emojiKey)}
                  </div>
                  <span style={{ color: "#f1f5f9", fontWeight: 700, fontSize: "0.95rem" }}>
                    {t(selectedObj.nameKey)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  style={{
                    width: "28px", height: "28px", borderRadius: "6px",
                    background: "rgba(255,255,255,0.08)", color: "#94a3b8",
                    border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >×</button>
              </div>

              {/* Scrollable body */}
              <div style={{ padding: "14px 16px", overflowY: "auto", flex: 1 }}>
                <p style={{ color: "#cbd5e1", fontSize: "0.85rem", lineHeight: 1.65, marginBottom: "12px" }}>
                  {t(selectedObj.infoKey)}
                </p>
                <div style={{
                  background: `${accent}15`, border: `1px solid ${accent}35`,
                  borderRadius: "8px", padding: "10px 12px",
                  display: "flex", gap: "8px", alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: "1rem", flexShrink: 0 }}>💡</span>
                  <p style={{ color: accent, fontSize: "0.82rem", fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
                    {t(selectedObj.factKey)}
                  </p>
                </div>
              </div>

              {/* Close footer */}
              <div style={{ padding: "12px 16px", borderTop: `1px solid rgba(255,255,255,0.06)` }}>
                <button
                  onClick={() => setSelectedId(null)}
                  style={{
                    width: "100%", padding: "0.6rem", borderRadius: "8px",
                    background: accent, color: "#ffffff", fontWeight: 700,
                    fontSize: "0.88rem", border: "none", cursor: "pointer",
                  }}
                >
                  {t("scene.close")} ✓
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom bar — chips + instructions */}
      <div
        className="shrink-0"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.08)",
          background: "rgba(15,23,42,0.95)",
          padding: "10px 24px",
          display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap",
        }}
      >
        <span style={{ color: "#64748b", fontSize: "0.78rem", fontWeight: 500, whiteSpace: "nowrap", flexShrink: 0 }}>
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
                  padding: "5px 14px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: 600,
                  border: active ? `1.5px solid ${ac}` : "1.5px solid rgba(255,255,255,0.12)",
                  background: active ? `${ac}22` : "rgba(255,255,255,0.05)",
                  color: active ? ac : "#94a3b8",
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
