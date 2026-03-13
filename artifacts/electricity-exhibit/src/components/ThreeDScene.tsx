import { useRef, useState, Suspense } from "react";
import { Canvas, useFrame, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Text, Sphere, Box, Cylinder, Cone } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { useLanguage } from "@/context/LanguageContext";
import { useApp } from "@/context/AppContext";

interface SceneObject {
  id: string;
  nameKey: string;
  infoKey: string;
  position: [number, number, number];
  color: string;
  glowColor: string;
}

const sceneObjects: SceneObject[] = [
  { id: "dam", nameKey: "obj.dam.name", infoKey: "obj.dam.info", position: [-6, 0.5, 0], color: "#64748b", glowColor: "#38bdf8" },
  { id: "turbine", nameKey: "obj.turbine.name", infoKey: "obj.turbine.info", position: [-3, -0.5, 0], color: "#06b6d4", glowColor: "#22d3ee" },
  { id: "generator", nameKey: "obj.generator.name", infoKey: "obj.generator.info", position: [0, -0.5, 0], color: "#8b5cf6", glowColor: "#a78bfa" },
  { id: "transformer", nameKey: "obj.transformer.name", infoKey: "obj.transformer.info", position: [3, -0.5, 0], color: "#f59e0b", glowColor: "#fbbf24" },
  { id: "lines", nameKey: "obj.lines.name", infoKey: "obj.lines.info", position: [3, 1.5, 0], color: "#6b7280", glowColor: "#9ca3af" },
  { id: "house", nameKey: "obj.house.name", infoKey: "obj.house.info", position: [6, -0.5, 0], color: "#10b981", glowColor: "#34d399" },
];

function Dam({ onClick, hovered }: { onClick: () => void; hovered: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.05;
    }
  });
  return (
    <group ref={ref} position={[-6, 0.5, 0]} onClick={onClick} onPointerOver={(e: ThreeEvent<PointerEvent>) => e.stopPropagation()}>
      <Box args={[1.5, 2, 1]} castShadow>
        <meshStandardMaterial color={hovered ? "#94a3b8" : "#475569"} emissive={hovered ? "#1e3a5f" : "#000"} emissiveIntensity={hovered ? 0.4 : 0} />
      </Box>
      {/* Water */}
      <Box args={[1.5, 0.3, 1]} position={[0, 1.15, 0]}>
        <meshStandardMaterial color="#0ea5e9" transparent opacity={0.7} />
      </Box>
      <Text position={[0, -1.4, 0]} fontSize={0.35} color="white" anchorX="center">DAM</Text>
    </group>
  );
}

function Turbine({ onClick, hovered }: { onClick: () => void; hovered: boolean }) {
  const bladeRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (bladeRef.current) bladeRef.current.rotation.z = clock.getElapsedTime() * 2;
  });
  return (
    <group position={[-3, -0.5, 0]} onClick={onClick}>
      <Cylinder args={[0.4, 0.4, 1, 16]}>
        <meshStandardMaterial color={hovered ? "#22d3ee" : "#06b6d4"} emissive={hovered ? "#0891b2" : "#000"} emissiveIntensity={hovered ? 0.5 : 0} />
      </Cylinder>
      <group ref={bladeRef} position={[0, 0.1, 0]}>
        {[0, 120, 240].map((angle) => (
          <group key={angle} rotation={[0, 0, (angle * Math.PI) / 180]}>
            <Box args={[0.15, 0.7, 0.08]} position={[0, 0.45, 0]}>
              <meshStandardMaterial color="#e0f2fe" />
            </Box>
          </group>
        ))}
      </group>
      <Text position={[0, -1, 0]} fontSize={0.28} color="white" anchorX="center">TURBINE</Text>
    </group>
  );
}

function Generator({ onClick, hovered }: { onClick: () => void; hovered: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 1.5;
  });
  return (
    <group position={[0, -0.5, 0]} onClick={onClick}>
      <Box args={[1.2, 0.9, 1]}>
        <meshStandardMaterial color={hovered ? "#a78bfa" : "#7c3aed"} emissive={hovered ? "#5b21b6" : "#000"} emissiveIntensity={hovered ? 0.5 : 0} />
      </Box>
      <mesh ref={ref} position={[0, 0.6, 0]}>
        <torusGeometry args={[0.3, 0.08, 8, 24]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.5} />
      </mesh>
      <Text position={[0, -0.9, 0]} fontSize={0.26} color="white" anchorX="center">GENERATOR</Text>
    </group>
  );
}

function Transformer({ onClick, hovered }: { onClick: () => void; hovered: boolean }) {
  return (
    <group position={[3, -0.5, 0]} onClick={onClick}>
      <Box args={[1, 1.2, 0.8]}>
        <meshStandardMaterial color={hovered ? "#fcd34d" : "#b45309"} emissive={hovered ? "#92400e" : "#000"} emissiveIntensity={hovered ? 0.4 : 0} />
      </Box>
      <Cylinder args={[0.08, 0.08, 0.8, 8]} position={[-0.25, 1, 0]}>
        <meshStandardMaterial color="#9ca3af" />
      </Cylinder>
      <Cylinder args={[0.08, 0.08, 0.8, 8]} position={[0.25, 1, 0]}>
        <meshStandardMaterial color="#9ca3af" />
      </Cylinder>
      <Text position={[0, -1, 0]} fontSize={0.26} color="white" anchorX="center">TRANSFORMER</Text>
    </group>
  );
}

function Lines({ onClick, hovered }: { onClick: () => void; hovered: boolean }) {
  return (
    <group position={[3, 1.5, 0]} onClick={onClick}>
      {[-1, 0, 1].map((x) => (
        <group key={x} position={[x * 1.5, 0, 0]}>
          <Cylinder args={[0.04, 0.04, 2, 6]} position={[0, -1, 0]}>
            <meshStandardMaterial color="#6b7280" />
          </Cylinder>
          <Box args={[0.8, 0.04, 0.04]} position={[0, -0.1, 0]}>
            <meshStandardMaterial color={hovered ? "#d1d5db" : "#9ca3af"} emissive={hovered ? "#6b7280" : "#000"} emissiveIntensity={hovered ? 0.3 : 0} />
          </Box>
        </group>
      ))}
      <Text position={[0, -1.8, 0]} fontSize={0.26} color="white" anchorX="center">LINES</Text>
    </group>
  );
}

function House({ onClick, hovered }: { onClick: () => void; hovered: boolean }) {
  return (
    <group position={[6, -0.5, 0]} onClick={onClick}>
      <Box args={[1.2, 1, 1]}>
        <meshStandardMaterial color={hovered ? "#34d399" : "#059669"} emissive={hovered ? "#065f46" : "#000"} emissiveIntensity={hovered ? 0.4 : 0} />
      </Box>
      <Cone args={[0.85, 0.7, 4]} position={[0, 0.85, 0]} rotation={[0, Math.PI / 4, 0]}>
        <meshStandardMaterial color="#dc2626" />
      </Cone>
      {/* Window glow */}
      <Box args={[0.25, 0.25, 0.05]} position={[0, 0, 0.53]}>
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={1} />
      </Box>
      <Text position={[0, -0.9, 0]} fontSize={0.3} color="white" anchorX="center">HOUSE</Text>
    </group>
  );
}

function WireLine({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const points = [new THREE.Vector3(...from), new THREE.Vector3(...to)];
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial color="#fbbf24" opacity={0.6} transparent />
    </line>
  );
}

function Scene({ onSelect }: { onSelect: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  const handleClick = (id: string) => {
    onSelect(id);
  };

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 10, 5]} intensity={1.5} color="#a78bfa" />
      <pointLight position={[-8, 5, 3]} intensity={0.8} color="#38bdf8" />
      <pointLight position={[8, 5, 3]} intensity={0.8} color="#34d399" />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[30, 12]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* Connection wires */}
      <WireLine from={[-5.2, 0.5, 0]} to={[-3.6, -0.5, 0]} />
      <WireLine from={[-2.4, -0.5, 0]} to={[-0.6, -0.5, 0]} />
      <WireLine from={[0.6, -0.5, 0]} to={[2.4, -0.5, 0]} />
      <WireLine from={[3, 0.2, 0]} to={[3, 1.0, 0]} />
      <WireLine from={[3.6, -0.5, 0]} to={[5.4, -0.5, 0]} />

      <Dam onClick={() => handleClick("dam")} hovered={hovered === "dam"} />
      <Turbine onClick={() => handleClick("turbine")} hovered={hovered === "turbine"} />
      <Generator onClick={() => handleClick("generator")} hovered={hovered === "generator"} />
      <Transformer onClick={() => handleClick("transformer")} hovered={hovered === "transformer"} />
      <Lines onClick={() => handleClick("lines")} hovered={hovered === "lines"} />
      <House onClick={() => handleClick("house")} hovered={hovered === "house"} />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={25}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
}

export default function ThreeDScene() {
  const { t } = useLanguage();
  const { setPage } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedObj = sceneObjects.find((o) => o.id === selectedId);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#020817]">
      {/* Title */}
      <div className="relative z-10 text-center pt-6 pb-2 px-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">
          ⚡ {t("scene.title")}
        </h1>
      </div>

      {/* 3D Canvas */}
      <div className="flex-1 relative" style={{ minHeight: "500px" }}>
        <Canvas
          camera={{ position: [0, 3, 14], fov: 50 }}
          shadows
          className="w-full h-full"
        >
          <Suspense fallback={null}>
            <Scene onSelect={setSelectedId} />
          </Suspense>
        </Canvas>

        {/* Popup */}
        <AnimatePresence>
          {selectedId && selectedObj && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-[#0f1629]/95 backdrop-blur border border-cyan-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl mx-4"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-extrabold text-cyan-300">
                  {t(selectedObj.nameKey)}
                </h3>
                <button
                  onClick={() => setSelectedId(null)}
                  className="text-white/60 hover:text-white text-2xl ml-4 leading-none"
                >
                  ×
                </button>
              </div>
              <p className="text-white/90 text-base leading-relaxed">
                {t(selectedObj.infoKey)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      <div className="relative z-10 text-center px-4 py-3 text-cyan-300/70 text-sm">
        {t("scene.instructions")}
      </div>

      {/* Nav Buttons */}
      <div className="relative z-10 flex justify-between items-center px-8 pb-8">
        <button
          onClick={() => setPage("landing")}
          className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-lg font-semibold border border-white/20 transition-all"
        >
          ← {t("scene.back")}
        </button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => setPage("age")}
          className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-lg font-bold rounded-xl shadow-lg shadow-cyan-500/30"
        >
          {t("scene.next")} →
        </motion.button>
      </div>
    </div>
  );
}
