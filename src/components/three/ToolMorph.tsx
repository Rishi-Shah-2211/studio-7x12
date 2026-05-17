"use client";

/**
 * ToolMorph — realistic salon tools rendered as 3D product shots.
 *
 * Perf-tuned: progress driven via ref (no React re-renders during scroll),
 * single shadow caster, lower-cost materials, gentle bloom.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  RoundedBox,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import type { ToolKind } from "@/lib/data";

type Props = {
  tool?: ToolKind;
  /** Static progress 0..1, OR a ref that scroll updates frame-by-frame. */
  progress?: number;
  progressRef?: MutableRefObject<number>;
  className?: string;
};

/* ===========================================================
   SCISSOR
   =========================================================== */
function Scissor({ open = 0.45 }: { open?: number }) {
  const bladeShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0);
    s.lineTo(0.04, -0.04);
    s.lineTo(0.12, 0);
    s.bezierCurveTo(0.18, 0.15, 0.14, 0.6, 0.06, 1.3);
    s.bezierCurveTo(0.04, 1.6, 0.02, 1.85, 0, 1.95);
    s.bezierCurveTo(-0.02, 1.85, -0.04, 1.6, -0.05, 1.3);
    s.bezierCurveTo(-0.08, 0.6, -0.1, 0.2, -0.08, 0);
    s.lineTo(-0.04, -0.04);
    s.lineTo(0, 0);
    return s;
  }, []);

  const bladeExtrude = useMemo<THREE.ExtrudeGeometryOptions>(
    () => ({
      depth: 0.05,
      bevelEnabled: true,
      bevelSize: 0.02,
      bevelThickness: 0.015,
      bevelSegments: 3,
      curveSegments: 18,
    }),
    []
  );

  const handleProfile = useMemo(
    () => [
      new THREE.Vector2(0.04, 0),
      new THREE.Vector2(0.05, 0.1),
      new THREE.Vector2(0.05, 0.6),
      new THREE.Vector2(0.04, 0.8),
    ],
    []
  );

  return (
    <group scale={0.78}>
      {[1, -1].map((side) => (
        <group key={side} rotation={[0, 0, side * open * 0.55]}>
          <mesh castShadow receiveShadow>
            <extrudeGeometry args={[bladeShape, bladeExtrude]} />
            <meshStandardMaterial
              color="#C9C5BB"
              metalness={0.85}
              roughness={0.42}
              envMapIntensity={0.55}
            />
          </mesh>
          <mesh
            position={[side * 0.22, -0.45, 0.025]}
            rotation={[0, 0, side * 0.55]}
            castShadow
          >
            <latheGeometry args={[handleProfile, 20]} />
            <meshStandardMaterial color="#1A1816" metalness={0.3} roughness={0.55} />
          </mesh>
          <group position={[side * 0.55, -0.95, 0.025]} rotation={[0, 0, side * 0.3]}>
            <mesh castShadow>
              <torusGeometry args={[0.26, 0.045, 16, 36]} />
              <meshStandardMaterial color="#1A1816" metalness={0.4} roughness={0.5} />
            </mesh>
            <mesh>
              <torusGeometry args={[0.225, 0.005, 12, 36]} />
              <meshStandardMaterial color="#8B5A2B" metalness={0.7} roughness={0.45} />
            </mesh>
          </group>
        </group>
      ))}
      <group position={[0, 0, 0.05]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.05, 24]} />
          <meshStandardMaterial color="#A07C50" metalness={0.6} roughness={0.45} />
        </mesh>
        <mesh position={[0, 0.026, 0]}>
          <boxGeometry args={[0.1, 0.005, 0.015]} />
          <meshStandardMaterial color="#1A1816" metalness={0.2} roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

/* ===========================================================
   COMB
   =========================================================== */
function Comb() {
  const spineShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-1.1, 0);
    s.lineTo(1.1, 0);
    s.lineTo(1.05, 0.18);
    s.lineTo(-1.05, 0.18);
    s.lineTo(-1.1, 0);
    return s;
  }, []);

  const spineExtrude = useMemo<THREE.ExtrudeGeometryOptions>(
    () => ({
      depth: 0.16,
      bevelEnabled: true,
      bevelSize: 0.02,
      bevelThickness: 0.02,
      bevelSegments: 2,
    }),
    []
  );

  const toothShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.025, 0);
    s.lineTo(0.025, 0);
    s.lineTo(0.015, -0.7);
    s.lineTo(-0.015, -0.7);
    s.lineTo(-0.025, 0);
    return s;
  }, []);

  const toothExtrude = useMemo<THREE.ExtrudeGeometryOptions>(
    () => ({
      depth: 0.1,
      bevelEnabled: true,
      bevelSize: 0.005,
      bevelThickness: 0.005,
      bevelSegments: 1,
    }),
    []
  );

  const teeth = 24;
  return (
    <group position={[0, 0.2, 0]} rotation={[0.15, 0, 0]} scale={0.9}>
      <mesh castShadow position={[0, 0.15, -0.08]}>
        <extrudeGeometry args={[spineShape, spineExtrude]} />
        <meshStandardMaterial
          color="#0F0E0C"
          metalness={0.15}
          roughness={0.6}
          envMapIntensity={0.35}
        />
      </mesh>
      {Array.from({ length: teeth }).map((_, i) => {
        const x = -1.0 + (i / (teeth - 1)) * 2.0;
        return (
          <mesh key={i} position={[x, 0.1, -0.03]} castShadow>
            <extrudeGeometry args={[toothShape, toothExtrude]} />
            <meshStandardMaterial color="#1A1816" metalness={0.15} roughness={0.6} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ===========================================================
   RAZOR
   =========================================================== */
function Razor() {
  const handleProfile = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const segments = 30;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = -0.8 + t * 1.5;
      const r = 0.085 + Math.sin(t * Math.PI * 22) * 0.004;
      pts.push(new THREE.Vector2(r, y));
    }
    return pts;
  }, []);

  return (
    <group rotation={[0.2, 0, 0]} scale={0.9}>
      <mesh castShadow>
        <latheGeometry args={[handleProfile, 32]} />
        <meshStandardMaterial
          color="#A07C50"
          metalness={0.75}
          roughness={0.45}
          envMapIntensity={0.5}
        />
      </mesh>
      <mesh position={[0, -0.85, 0]} castShadow>
        <sphereGeometry args={[0.085, 20, 20]} />
        <meshStandardMaterial color="#A07C50" metalness={0.75} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.78, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.08, 20]} />
        <meshStandardMaterial color="#5A3F26" metalness={0.7} roughness={0.55} />
      </mesh>
      <RoundedBox
        args={[0.85, 0.08, 0.32]}
        radius={0.04}
        smoothness={3}
        position={[0, 0.86, 0]}
        castShadow
      >
        <meshStandardMaterial color="#A07C50" metalness={0.75} roughness={0.45} />
      </RoundedBox>
      <RoundedBox
        args={[0.85, 0.06, 0.18]}
        radius={0.02}
        smoothness={3}
        position={[0, 0.95, 0.08]}
        castShadow
      >
        <meshStandardMaterial color="#A07C50" metalness={0.75} roughness={0.45} />
      </RoundedBox>
      <mesh position={[0, 0.94, -0.02]} castShadow>
        <boxGeometry args={[0.95, 0.012, 0.28]} />
        <meshStandardMaterial
          color="#D8D5CD"
          metalness={0.7}
          roughness={0.3}
          envMapIntensity={0.7}
        />
      </mesh>
    </group>
  );
}

/* ===========================================================
   BRUSH
   =========================================================== */
function Brush() {
  const handleProfile = useMemo(
    () => [
      new THREE.Vector2(0.06, -1.0),
      new THREE.Vector2(0.075, -0.6),
      new THREE.Vector2(0.085, -0.2),
      new THREE.Vector2(0.09, 0.0),
      new THREE.Vector2(0.1, 0.12),
    ],
    []
  );

  return (
    <group rotation={[0.05, 0, 0]} scale={0.95}>
      <mesh castShadow>
        <latheGeometry args={[handleProfile, 24]} />
        <meshStandardMaterial
          color="#5C3A1E"
          metalness={0.05}
          roughness={0.78}
          envMapIntensity={0.3}
        />
      </mesh>
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.13, 0.22, 24]} />
        <meshStandardMaterial
          color="#A07C50"
          metalness={0.7}
          roughness={0.5}
          envMapIntensity={0.45}
        />
      </mesh>
      <mesh position={[0, 0.34, 0]} castShadow>
        <torusGeometry args={[0.15, 0.012, 10, 24]} />
        <meshStandardMaterial color="#5A3F26" metalness={0.6} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <coneGeometry args={[0.22, 0.85, 48, 1, true]} />
        <meshStandardMaterial
          color="#E8DFCE"
          metalness={0}
          roughness={0.98}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0.6, 0]} castShadow>
        <coneGeometry args={[0.18, 0.7, 24, 1, true]} />
        <meshStandardMaterial
          color="#CFC6B7"
          metalness={0}
          roughness={0.98}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ===========================================================
   POLISH BOTTLE — cheaper physical material (no transmission)
   =========================================================== */
function Polish() {
  return (
    <group rotation={[0.1, 0.2, 0]} scale={0.95}>
      {/* Glass body — fake glass via slight transparency + low roughness */}
      <RoundedBox args={[0.7, 0.95, 0.45]} radius={0.06} smoothness={4} castShadow>
        <meshPhysicalMaterial
          color="#1A1612"
          metalness={0.05}
          roughness={0.25}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
          transparent
          opacity={0.78}
          envMapIntensity={0.4}
        />
      </RoundedBox>
      {/* Liquid inside */}
      <RoundedBox
        args={[0.66, 0.62, 0.42]}
        radius={0.05}
        smoothness={3}
        position={[0, -0.15, 0]}
      >
        <meshStandardMaterial color="#5A2310" metalness={0.1} roughness={0.5} />
      </RoundedBox>
      {/* Label */}
      <mesh position={[0, 0, 0.231]}>
        <planeGeometry args={[0.5, 0.32]} />
        <meshStandardMaterial color="#1A1816" metalness={0.05} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0, 0.232]}>
        <planeGeometry args={[0.3, 0.06]} />
        <meshStandardMaterial
          color="#A07C50"
          emissive="#5A3F26"
          emissiveIntensity={0.15}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.56, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.16, 0.14, 20]} />
        <meshStandardMaterial color="#0F0E0C" metalness={0.2} roughness={0.6} />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.42, 28]} />
        <meshStandardMaterial color="#0F0E0C" metalness={0.3} roughness={0.55} />
      </mesh>
      <mesh position={[0, 0.66, 0]}>
        <torusGeometry args={[0.205, 0.015, 10, 28]} />
        <meshStandardMaterial color="#A07C50" metalness={0.7} roughness={0.4} />
      </mesh>
    </group>
  );
}

/* ===========================================================
   LIPSTICK
   =========================================================== */
function Lipstick() {
  const tubeProfile = useMemo(
    () => [
      new THREE.Vector2(0.22, -0.8),
      new THREE.Vector2(0.22, -0.3),
      new THREE.Vector2(0.21, -0.28),
      new THREE.Vector2(0.18, -0.28),
      new THREE.Vector2(0.18, 0.2),
    ],
    []
  );

  const bulletProfile = useMemo(
    () => [
      new THREE.Vector2(0.15, 0.2),
      new THREE.Vector2(0.15, 0.55),
      new THREE.Vector2(0.13, 0.65),
      new THREE.Vector2(0.05, 0.78),
      new THREE.Vector2(0, 0.82),
    ],
    []
  );

  return (
    <group rotation={[0.05, 0.4, -0.1]} scale={0.95}>
      <mesh castShadow>
        <latheGeometry args={[tubeProfile, 36]} />
        <meshStandardMaterial
          color="#A07C50"
          metalness={0.75}
          roughness={0.42}
          envMapIntensity={0.5}
        />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <torusGeometry args={[0.215, 0.015, 10, 36]} />
        <meshStandardMaterial color="#5A3F26" metalness={0.6} roughness={0.5} />
      </mesh>
      <mesh castShadow>
        <latheGeometry args={[bulletProfile, 36]} />
        <meshStandardMaterial
          color="#5A2310"
          metalness={0.1}
          roughness={0.5}
          envMapIntensity={0.3}
        />
      </mesh>
    </group>
  );
}

const TOOLS: Record<ToolKind, React.FC<{ open?: number }>> = {
  scissor: Scissor,
  comb: Comb,
  razor: Razor,
  brush: Brush,
  polish: Polish,
  lipstick: Lipstick,
};

/* ===========================================================
   Animated rig — reads progress from ref, zero React re-render
   =========================================================== */
function Rig({
  tool,
  progressRef,
  staticProgress,
}: {
  tool: ToolKind;
  progressRef?: MutableRefObject<number>;
  staticProgress?: number;
}) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const targetTool = useRef<ToolKind>(tool);
  const [renderTool, setRenderTool] = useState<ToolKind>(tool);
  const morphPhase = useRef(0);
  const morphing = useRef(false);
  // Smoothed scroll value to avoid micro-jitter
  const smoothScroll = useRef(0);

  useEffect(() => {
    if (tool !== renderTool) {
      targetTool.current = tool;
      morphing.current = true;
      morphPhase.current = 0;
    }
  }, [tool, renderTool]);

  useFrame((state, delta) => {
    if (!group.current || !inner.current) return;
    const t = state.clock.elapsedTime;
    const rawScroll = progressRef?.current ?? staticProgress ?? 0;

    // Exponential smoothing — kills any setState jitter from scroll
    const k = 1 - Math.exp(-delta * 6);
    smoothScroll.current += (rawScroll - smoothScroll.current) * k;

    const rotY = smoothScroll.current * Math.PI * 2 + t * 0.18;
    group.current.rotation.y = rotY;
    group.current.rotation.x = Math.sin(t * 0.4) * 0.05 - 0.05;
    group.current.position.y = Math.sin(t * 0.55) * 0.04 - 0.15;

    if (morphing.current) {
      morphPhase.current = Math.min(1, morphPhase.current + delta * 2.2);
      const p = morphPhase.current;
      if (p < 0.5) {
        const s = 1 - p * 2;
        inner.current.scale.setScalar(s);
        inner.current.rotation.z = (1 - s) * Math.PI * 0.6;
      } else {
        if (renderTool !== targetTool.current) setRenderTool(targetTool.current);
        const s = (p - 0.5) * 2;
        inner.current.scale.setScalar(s);
        inner.current.rotation.z = (1 - s) * -Math.PI * 0.6;
      }
      if (p >= 1) {
        morphing.current = false;
        inner.current.scale.setScalar(1);
        inner.current.rotation.z = 0;
      }
    }
  });

  const ToolComponent = TOOLS[renderTool];
  return (
    <group ref={group}>
      <group ref={inner}>
        <ToolComponent />
      </group>
    </group>
  );
}

/* ===========================================================
   Public component
   =========================================================== */
export function ToolMorph({
  tool = "scissor",
  progress,
  progressRef,
  className,
}: Props) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <div className={className}>
      <Canvas
        shadows="basic"
        dpr={isMobile ? [1, 1.2] : [1, 1.5]}
        camera={{ position: [0, 0.2, 5.4], fov: 32 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          powerPreference: "high-performance",
        }}
      >
        {/* Calmer 3-point lighting */}
        <ambientLight intensity={0.35} color="#F2EBDD" />
        <directionalLight
          position={[4, 5, 3]}
          intensity={1.2}
          color="#FFE9C8"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0002}
        />
        <pointLight position={[-4, 2, -1]} intensity={0.6} color="#C2410C" />
        <pointLight position={[0, -3, 3]} intensity={0.4} color="#B87333" />

        <Rig tool={tool} progressRef={progressRef} staticProgress={progress} />

        <ContactShadows
          position={[0, -1.5, 0]}
          opacity={0.4}
          scale={6}
          blur={2.4}
          far={2.5}
          color="#000000"
        />

        <Environment preset="apartment" environmentIntensity={0.45} />

        {/* Very gentle bloom — only the brightest hot pixels */}
        {!isMobile && (
          <EffectComposer>
            <Bloom
              intensity={0.18}
              luminanceThreshold={0.96}
              luminanceSmoothing={0.4}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.25} darkness={0.55} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
