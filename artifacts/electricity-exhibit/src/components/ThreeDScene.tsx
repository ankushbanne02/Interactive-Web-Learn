import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
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
  color: string;
  accent: string;
}

const sceneObjects: SceneObject[] = [
  { id: "dam", nameKey: "obj.dam.name", infoKey: "obj.dam.info", factKey: "obj.dam.fact", emojiKey: "obj.dam.emoji", color: "#64748b", accent: "#38bdf8" },
  { id: "turbine", nameKey: "obj.turbine.name", infoKey: "obj.turbine.info", factKey: "obj.turbine.fact", emojiKey: "obj.turbine.emoji", color: "#06b6d4", accent: "#22d3ee" },
  { id: "generator", nameKey: "obj.generator.name", infoKey: "obj.generator.info", factKey: "obj.generator.fact", emojiKey: "obj.generator.emoji", color: "#8b5cf6", accent: "#a78bfa" },
  { id: "transformer", nameKey: "obj.transformer.name", infoKey: "obj.transformer.info", factKey: "obj.transformer.fact", emojiKey: "obj.transformer.emoji", color: "#f59e0b", accent: "#fbbf24" },
  { id: "lines", nameKey: "obj.lines.name", infoKey: "obj.lines.info", factKey: "obj.lines.fact", emojiKey: "obj.lines.emoji", color: "#6b7280", accent: "#9ca3af" },
  { id: "house", nameKey: "obj.house.name", infoKey: "obj.house.info", factKey: "obj.house.fact", emojiKey: "obj.house.emoji", color: "#10b981", accent: "#34d399" },
];

const accentColors: Record<string, string> = {
  dam: "#0ea5e9", turbine: "#06b6d4", generator: "#8b5cf6",
  transformer: "#f59e0b", lines: "#6b7280", house: "#10b981",
};

function Dam({ onClick, hovered }: { onClick: () => void; hovered: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.position.y = 0.5 + Math.sin(clock.getElapsedTime() * 0.5) * 0.04;
  });
  return (
    <group ref={ref} onClick={onClick}>
      <Box args={[1.5, 2.2, 1]} castShadow>
        <meshStandardMaterial color={hovered ? "#94a3b8" : "#475569"} emissive={hovered ? "#0ea5e9" : "#000"} emissiveIntensity={hovered ? 0.25 : 0} />
      </Box>
      <Box args={[1.5, 0.35, 1]} position={[0, 1.27, 0]}>
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.8} emissive="#0ea5e9" emissiveIntensity={0.3} />
      </Box>
      <Box args={[0.2, 0.4, 1.02]} position={[0, -0.6, 0]}>
        <meshStandardMaterial color="#fbbf24" />
      </Box>
      <Text position={[0, -1.5, 0.6]} fontSize={0.3} color="white" anchorX="center" outlineWidth={0.02} outlineColor="#000">💧 DAM</Text>
    </group>
  );
}

function Turbine({ onClick, hovered }: { onClick: () => void; hovered: boolean }) {
  const bladeRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (bladeRef.current) bladeRef.current.rotation.z = clock.getElapsedTime() * 2.5;
  });
  return (
    <group position={[-3, -0.5, 0]} onClick={onClick}>
      <Cylinder args={[0.45, 0.45, 1.1, 20]}>
        <meshStandardMaterial color={hovered ? "#22d3ee" : "#0891b2"} emissive={hovered ? "#0ea5e9" : "#000"} emissiveIntensity={hovered ? 0.4 : 0} />
      </Cylinder>
      <group ref={bladeRef} position={[0, 0.15, 0]}>
        {[0, 120, 240].map((angle) => (
          <group key={angle} rotation={[0, 0, (angle * Math.PI) / 180]}>
            <Box args={[0.13, 0.75, 0.07]} position={[0, 0.48, 0]}>
              <meshStandardMaterial color="#e0f2fe" emissive="#bae6fd" emissiveIntensity={0.3} />
            </Box>
          </group>
        ))}
        <mesh>
          <sphereGeometry args={[0.12, 12, 12]} />
          <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.5} />
        </mesh>
      </group>
      <Text position={[0, -1.1, 0.6]} fontSize={0.28} color="white" anchorX="center" outlineWidth={0.02} outlineColor="#000">⚙️ TURBINE</Text>
    </group>
  );
}

function Generator({ onClick, hovered }: { onClick: () => void; hovered: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ringRef.current) ringRef.current.rotation.y = clock.getElapsedTime() * 1.8;
  });
  return (
    <group position={[0, -0.5, 0]} onClick={onClick}>
      <Box args={[1.3, 1.0, 1]}>
        <meshStandardMaterial color={hovered ? "#a78bfa" : "#6d28d9"} emissive={hovered ? "#5b21b6" : "#000"} emissiveIntensity={hovered ? 0.5 : 0} />
      </Box>
      <Box args={[1.35, 0.15, 1.05]} position={[0, 0.57, 0]}>
        <meshStandardMaterial color="#4c1d95" />
      </Box>
      <mesh ref={ringRef} position={[0, 0.75, 0]}>
        <torusGeometry args={[0.32, 0.09, 8, 24]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.7} />
      </mesh>
      <Text position={[0, -1.0, 0.6]} fontSize={0.26} color="white" anchorX="center" outlineWidth={0.02} outlineColor="#000">🔋 GENERATOR</Text>
    </group>
  );
}

function Transformer({ onClick, hovered }: { onClick: () => void; hovered: boolean }) {
  const glowRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.4 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
    }
  });
  return (
    <group position={[3, -0.5, 0]} onClick={onClick}>
      <Box args={[1.1, 1.3, 0.9]}>
        <meshStandardMaterial color={hovered ? "#fcd34d" : "#92400e"} emissive={hovered ? "#78350f" : "#000"} emissiveIntensity={hovered ? 0.4 : 0} />
      </Box>
      <Box args={[1.15, 0.1, 0.95]} position={[0, 0.7, 0]}>
        <meshStandardMaterial color="#78350f" />
      </Box>
      {[-0.28, 0, 0.28].map((x, i) => (
        <group key={i} position={[x, 0.95, 0]}>
          <Cylinder args={[0.05, 0.05, 0.6, 8]}>
            <meshStandardMaterial color="#9ca3af" />
          </Cylinder>
          <mesh ref={i === 1 ? glowRef : undefined} position={[0, 0.35, 0]}>
            <sphereGeometry args={[0.09, 8, 8]} />
            <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.6} />
          </mesh>
        </group>
      ))}
      <Text position={[0, -1.1, 0.55]} fontSize={0.24} color="white" anchorX="center" outlineWidth={0.02} outlineColor="#000">🔌 TRANSFORMER</Text>
    </group>
  );
}

function Lines({ onClick, hovered }: { onClick: () => void; hovered: boolean }) {
  return (
    <group position={[3, 1.5, 0]} onClick={onClick}>
      {[-1.4, 0, 1.4].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <Cylinder args={[0.04, 0.06, 2.2, 6]} position={[0, -1.1, 0]}>
            <meshStandardMaterial color="#78716c" />
          </Cylinder>
          <Box args={[0.7, 0.05, 0.05]} position={[0, -0.2, 0]}>
            <meshStandardMaterial color={hovered ? "#d1d5db" : "#9ca3af"} emissive={hovered ? "#6b7280" : "#000"} emissiveIntensity={hovered ? 0.3 : 0} />
          </Box>
          <Box args={[0.5, 0.05, 0.05]} position={[0, -0.4, 0]}>
            <meshStandardMaterial color={hovered ? "#d1d5db" : "#9ca3af"} emissive={hovered ? "#6b7280" : "#000"} emissiveIntensity={hovered ? 0.3 : 0} />
          </Box>
          {[-0.2, 0.2].map((cx) => (
            <mesh key={cx} position={[cx, -0.25, 0]}>
              <sphereGeometry args={[0.05, 6, 6]} />
              <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.5} />
            </mesh>
          ))}
        </group>
      ))}
      <Text position={[0, -2.1, 0]} fontSize={0.26} color="white" anchorX="center" outlineWidth={0.02} outlineColor="#000">🗼 LINES</Text>
    </group>
  );
}

function House({ onClick, hovered }: { onClick: () => void; hovered: boolean }) {
  const windowRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (windowRef.current) {
      const mat = windowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = 0.7 + Math.sin(clock.getElapsedTime() * 1.5) * 0.3;
    }
  });
  return (
    <group position={[6, -0.5, 0]} onClick={onClick}>
      <Box args={[1.3, 1.1, 1.0]}>
        <meshStandardMaterial color={hovered ? "#34d399" : "#047857"} emissive={hovered ? "#065f46" : "#000"} emissiveIntensity={hovered ? 0.4 : 0} />
      </Box>
      <Cone args={[0.92, 0.75, 4]} position={[0, 0.92, 0]} rotation={[0, Math.PI / 4, 0]}>
        <meshStandardMaterial color="#dc2626" />
      </Cone>
      <mesh ref={windowRef} position={[0.2, 0.1, 0.52]}>
        <boxGeometry args={[0.28, 0.28, 0.05]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} />
      </mesh>
      <Box args={[0.28, 0.28, 0.05]} position={[-0.25, 0.1, 0.52]}>
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.7} />
      </Box>
      <Box args={[0.25, 0.5, 0.05]} position={[0, -0.3, 0.52]}>
        <meshStandardMaterial color="#92400e" />
      </Box>
      <Text position={[0, -1.0, 0.6]} fontSize={0.3} color="white" anchorX="center" outlineWidth={0.02} outlineColor="#000">🏠 HOUSE</Text>
    </group>
  );
}

function WireLine({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)];
  const geom = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <line geometry={geom}>
      <lineBasicMaterial color="#fbbf24" opacity={0.7} transparent />
    </line>
  );
}

function Scene({ onSelect, hoveredId, setHoveredId }: {
  onSelect: (id: string) => void;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
}) {
  return (
    <>
      <color attach="background" args={["#e0f2fe"]} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow color="#ffffff" />
      <pointLight position={[-8, 6, 4]} intensity={0.6} color="#c7d2fe" />
      <pointLight position={[10, 4, 4]} intensity={0.5} color="#d1fae5" />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[30, 14]} />
        <meshStandardMaterial color="#bfdbfe" />
      </mesh>
      {/* Ground grid lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.49, 0]}>
        <planeGeometry args={[30, 14]} />
        <meshStandardMaterial color="#93c5fd" wireframe opacity={0.3} transparent />
      </mesh>

      {/* Wires */}
      <WireLine from={[-5.1, 0.5, 0]} to={[-3.5, -0.5, 0]} />
      <WireLine from={[-2.5, -0.5, 0]} to={[-0.65, -0.5, 0]} />
      <WireLine from={[0.65, -0.5, 0]} to={[2.4, -0.5, 0]} />
      <WireLine from={[3, 0.2, 0]} to={[3, 1.1, 0]} />
      <WireLine from={[3.6, -0.5, 0]} to={[5.3, -0.5, 0]} />

      <Dam onClick={() => onSelect("dam")} hovered={hoveredId === "dam"} />
      <Turbine onClick={() => onSelect("turbine")} hovered={hoveredId === "turbine"} />
      <Generator onClick={() => onSelect("generator")} hovered={hoveredId === "generator"} />
      <Transformer onClick={() => onSelect("transformer")} hovered={hoveredId === "transformer"} />
      <Lines onClick={() => onSelect("lines")} hovered={hoveredId === "lines"} />
      <House onClick={() => onSelect("house")} hovered={hoveredId === "house"} />

      <OrbitControls enableDamping dampingFactor={0.06} minDistance={6} maxDistance={22} maxPolarAngle={Math.PI / 1.9} />
    </>
  );
}

export default function ThreeDScene() {
  const { t } = useLanguage();
  const { setPage } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const selectedObj = sceneObjects.find((o) => o.id === selectedId);
  const accentColor = selectedId ? accentColors[selectedId] : "#7c3aed";

  return (
    <div className="relative min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #e0f2fe 0%, #f0f9ff 60%, #fff 100%)" }}>
      {/* Top header */}
      <div className="relative z-10 px-6 pt-5 pb-2 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-5 py-2 shadow-sm border border-blue-100 mb-2">
          <span className="text-blue-600 font-bold text-sm uppercase tracking-wider">Step 1</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center">
          ⚡ {t("scene.title")}
        </h1>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 relative" style={{ minHeight: "500px" }}>
        <Canvas camera={{ position: [0, 3.5, 15], fov: 48 }} shadows className="w-full h-full">
          <Suspense fallback={null}>
            <Scene onSelect={setSelectedId} hoveredId={hoveredId} setHoveredId={setHoveredId} />
          </Suspense>
        </Canvas>

        {/* Info popup — full detailed panel */}
        <AnimatePresence>
          {selectedId && selectedObj && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute top-4 right-4 z-20 bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border-2"
              style={{ borderColor: accentColor + "60", maxHeight: "calc(100% - 2rem)" }}
            >
              {/* Colored header */}
              <div
                className="px-6 py-4 flex items-start justify-between gap-3"
                style={{ background: `linear-gradient(135deg, ${accentColor}20, ${accentColor}10)` }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md"
                    style={{ background: accentColor }}
                  >
                    {t(selectedObj.emojiKey)}
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-800">
                    {t(selectedObj.nameKey)}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedId(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg shrink-0 transition-colors"
                >
                  ×
                </button>
              </div>

              {/* Scrollable content */}
              <div className="px-6 py-4 overflow-y-auto" style={{ maxHeight: "55vh" }}>
                <p className="text-gray-700 text-base leading-relaxed mb-4">
                  {t(selectedObj.infoKey)}
                </p>

                {/* Fun fact box */}
                <div
                  className="rounded-2xl p-4 flex items-start gap-3"
                  style={{ background: `${accentColor}15`, border: `1.5px solid ${accentColor}40` }}
                >
                  <span className="text-2xl shrink-0">💡</span>
                  <p className="text-sm font-semibold" style={{ color: accentColor }}>
                    {t(selectedObj.factKey)}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-4">
                <button
                  onClick={() => setSelectedId(null)}
                  className="w-full py-3 text-white rounded-xl font-bold shadow-md transition-all hover:opacity-90"
                  style={{ background: accentColor }}
                >
                  {t("scene.close")} ✓
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Click-hint chips */}
      <div className="relative z-10 px-6 py-2 flex justify-center">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-5 py-2.5 shadow-sm border border-blue-100">
          <span className="text-blue-600 text-sm font-semibold">{t("scene.instructions")}</span>
        </div>
      </div>

      {/* Object chip buttons */}
      <div className="relative z-10 px-4 py-2 flex flex-wrap justify-center gap-2">
        {sceneObjects.map((obj) => (
          <button
            key={obj.id}
            onClick={() => setSelectedId(obj.id)}
            className={`px-4 py-2 rounded-full text-sm font-bold border-2 transition-all ${
              selectedId === obj.id
                ? "text-white shadow-lg scale-105"
                : "bg-white text-gray-600 border-gray-200 hover:scale-105"
            }`}
            style={selectedId === obj.id ? { background: accentColors[obj.id], borderColor: accentColors[obj.id] } : {}}
          >
            {t(obj.emojiKey)} {t(obj.nameKey).replace(/[💧⚙️🔋🔌🗼🏠]/g, "").trim()}
          </button>
        ))}
      </div>

      {/* Nav */}
      <div className="relative z-10 flex justify-between items-center px-8 pb-6 pt-2">
        <button
          onClick={() => setPage("landing")}
          className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-600 rounded-xl text-lg font-semibold border border-gray-200 shadow-sm transition-all hover:shadow-md"
        >
          ← {t("scene.back")}
        </button>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setPage("age")}
          className="px-10 py-4 text-white text-lg font-bold rounded-xl shadow-lg shadow-violet-200 transition-all"
          style={{ background: "linear-gradient(135deg, #7c3aed, #0ea5e9)" }}
        >
          {t("scene.next")} →
        </motion.button>
      </div>
    </div>
  );
}
