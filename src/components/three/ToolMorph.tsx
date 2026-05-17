"use client";

/**
 * ToolMorph
 * --------
 * The hero / pinned centerpiece. A stylized scissor + comb + razor + brush
 * built from primitives, lit dramatically, rotates with scroll and morphs
 * between tools as the user scrolls through service sections.
 *
 * Uses scrollProgress from a parent ScrollTrigger (0..1).
 * For the hero standalone case it gently rotates on its own.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { ToolKind } from "@/lib/data";

type Props = {
  tool?: ToolKind;
  /** 0..1 progress; if provided, overrides idle spin */
  progress?: number;
  className?: string;
};

/* ---------- Individual tool meshes ---------- */

function Scissor({ open = 0.4 }: { open?: number }) {
  const group = useRef<THREE.Group>(null);
  return (
    <group ref={group}>
      {/* Two blades */}
      {[1, -1].map((s) => (
        <group key={s} rotation={[0, 0, s * open * 0.6]}>
          <mesh position={[0, 0.6, 0]} castShadow>
            <coneGeometry args={[0.12, 1.6, 4]} />
            <meshStandardMaterial
              color="#D9D2C5"
              metalness={0.95}
              roughness={0.18}
            />
          </mesh>
          {/* Handle ring */}
          <mesh position={[s * 0.35, -0.55, 0]} castShadow>
            <torusGeometry args={[0.28, 0.06, 16, 32]} />
            <meshStandardMaterial
              color="#B87333"
              metalness={0.85}
              roughness={0.28}
            />
          </mesh>
          {/* Handle connector */}
          <mesh position={[s * 0.18, -0.18, 0]} rotation={[0, 0, s * 0.5]}>
            <cylinderGeometry args={[0.05, 0.05, 0.6, 16]} />
            <meshStandardMaterial color="#B87333" metalness={0.85} roughness={0.3} />
          </mesh>
        </group>
      ))}
      {/* Pivot */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.18, 16]} />
        <meshStandardMaterial color="#C2410C" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  );
}

function Comb() {
  const teeth = 18;
  return (
    <group>
      {/* Spine */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[2.2, 0.18, 0.18]} />
        <meshStandardMaterial color="#1A1816" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Teeth */}
      {Array.from({ length: teeth }).map((_, i) => (
        <mesh
          key={i}
          position={[-1 + (i / (teeth - 1)) * 2, -0.2, 0]}
          castShadow
        >
          <boxGeometry args={[0.05, 0.7, 0.12]} />
          <meshStandardMaterial color="#1A1816" metalness={0.4} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Razor() {
  return (
    <group>
      {/* Handle */}
      <mesh position={[0, -0.6, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.08, 1.4, 24]} />
        <meshStandardMaterial color="#B87333" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.9, 0.3, 0.5]} />
        <meshStandardMaterial color="#161412" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Blade */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.0, 0.06, 0.45]} />
        <meshStandardMaterial color="#F2EBDD" metalness={1} roughness={0.05} />
      </mesh>
    </group>
  );
}

function Brush() {
  return (
    <group>
      {/* Handle */}
      <mesh position={[0, -0.7, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.06, 1.4, 24]} />
        <meshStandardMaterial color="#7C2D12" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Ferrule */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.18, 0.3, 24]} />
        <meshStandardMaterial color="#B87333" metalness={0.95} roughness={0.18} />
      </mesh>
      {/* Bristles */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <coneGeometry args={[0.25, 0.7, 32]} />
        <meshStandardMaterial
          color="#F2EBDD"
          metalness={0.05}
          roughness={0.9}
        />
      </mesh>
    </group>
  );
}

function Polish() {
  return (
    <group>
      {/* Bottle */}
      <mesh position={[0, -0.1, 0]} castShadow>
        <boxGeometry args={[0.8, 1.0, 0.5]} />
        <meshPhysicalMaterial
          color="#C2410C"
          metalness={0.2}
          roughness={0.05}
          transmission={0.4}
          thickness={0.5}
        />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 0.2, 24]} />
        <meshStandardMaterial color="#161412" metalness={0.3} roughness={0.6} />
      </mesh>
      {/* Cap */}
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.5, 24]} />
        <meshStandardMaterial color="#1A1816" metalness={0.5} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Lipstick() {
  return (
    <group>
      {/* Base tube */}
      <mesh position={[0, -0.3, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 1.0, 32]} />
        <meshStandardMaterial color="#B87333" metalness={0.95} roughness={0.15} />
      </mesh>
      {/* Sleeve */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.5, 32]} />
        <meshStandardMaterial color="#1A1816" metalness={0.4} roughness={0.5} />
      </mesh>
      {/* Bullet */}
      <mesh position={[0, 0.75, 0]} rotation={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.35, 32]} />
        <meshStandardMaterial color="#7C2D12" metalness={0.2} roughness={0.4} />
      </mesh>
      <mesh position={[0.04, 0.95, 0]} rotation={[0, 0, -0.3]} castShadow>
        <coneGeometry args={[0.15, 0.25, 32]} />
        <meshStandardMaterial color="#7C2D12" metalness={0.2} roughness={0.4} />
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

/* ---------- The rotating, morphing rig ---------- */

function Rig({ tool, progress }: { tool: ToolKind; progress?: number }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const targetTool = useRef<ToolKind>(tool);
  const [renderTool, setRenderTool] = useState<ToolKind>(tool);
  const morphPhase = useRef(0); // 0 = settled, ramps 0->1 then back to 0
  const morphing = useRef(false);

  // Schedule a morph when tool prop changes
  useEffect(() => {
    if (tool !== renderTool) {
      targetTool.current = tool;
      morphing.current = true;
      morphPhase.current = 0;
    }
  }, [tool, renderTool]);

  useFrame((state, delta) => {
    if (!group.current || !inner.current) return;

    // Idle gentle rotation
    const t = state.clock.elapsedTime;
    const scroll = progress ?? 0;

    // Scroll-driven rotation: a full turn over the section
    const rotY = scroll * Math.PI * 2 + t * 0.15;
    group.current.rotation.y = rotY;
    group.current.rotation.x = Math.sin(t * 0.5) * 0.08;
    group.current.position.y = Math.sin(t * 0.6) * 0.05;

    // Morph: scale down -> swap -> scale up
    if (morphing.current) {
      morphPhase.current = Math.min(1, morphPhase.current + delta * 2.5);
      const p = morphPhase.current;
      if (p < 0.5) {
        const k = 1 - p * 2;
        inner.current.scale.setScalar(k);
        inner.current.rotation.z = (1 - k) * Math.PI;
      } else {
        if (renderTool !== targetTool.current) {
          setRenderTool(targetTool.current);
        }
        const k = (p - 0.5) * 2;
        inner.current.scale.setScalar(k);
        inner.current.rotation.z = (1 - k) * -Math.PI;
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

export function ToolMorph({ tool = "scissor", progress, className }: Props) {
  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0, 5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Dramatic key light from upper-right */}
        <ambientLight intensity={0.25} />
        <directionalLight
          position={[4, 5, 3]}
          intensity={1.6}
          color="#F2EBDD"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        {/* Ember rim light */}
        <pointLight position={[-3, 2, -2]} intensity={2.2} color="#C2410C" />
        {/* Copper fill from below */}
        <pointLight position={[0, -3, 2]} intensity={0.8} color="#B87333" />

        <Rig tool={tool} progress={progress} />

        <ContactShadows
          position={[0, -1.6, 0]}
          opacity={0.35}
          scale={6}
          blur={2.8}
          far={3}
          color="#000000"
        />
        <Environment preset="warehouse" />
      </Canvas>
    </div>
  );
}
