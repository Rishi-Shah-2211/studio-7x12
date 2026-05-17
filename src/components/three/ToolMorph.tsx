"use client";

/**
 * ToolMorph — realistic salon tools rendered as 3D product shots.
 *
 * Each tool uses proper geometry techniques:
 *  - Scissor blades: ExtrudeGeometry with curved Shape + bevel
 *  - Razor handle: Knurled cylinder via LatheGeometry
 *  - Polish bottle: RoundedBox glass + transmission material + liquid level
 *  - Lipstick & brush: LatheGeometry for accurate revolved profiles
 *  - Comb: ExtrudeGeometry with tapered teeth profile
 *
 * Scene: HDR studio environment, 3-point cinematic lighting,
 * subtle bloom postprocessing, contact shadows.
 */

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  Float,
  RoundedBox,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { ToolKind } from "@/lib/data";

type Props = {
  tool?: ToolKind;
  progress?: number;
  className?: string;
};

/* ===========================================================
   SCISSOR — proper blade profile, beveled, with screw pivot
   =========================================================== */
function Scissor({ open = 0.45 }: { open?: number }) {
  // Curved blade profile via 2D shape
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
      bevelSegments: 4,
      curveSegments: 24,
    }),
    []
  );

  // Handle (the ring + grip)
  const handleProfile = useMemo(() => {
    // Lathe profile of the handle bar — slim with slight taper
    return [
      new THREE.Vector2(0.04, 0),
      new THREE.Vector2(0.05, 0.1),
      new THREE.Vector2(0.05, 0.6),
      new THREE.Vector2(0.04, 0.8),
    ];
  }, []);

  return (
    <group scale={1.1}>
      {[1, -1].map((side) => (
        <group key={side} rotation={[0, 0, side * open * 0.55]}>
          {/* Blade */}
          <mesh castShadow receiveShadow>
            <extrudeGeometry args={[bladeShape, bladeExtrude]} />
            <meshStandardMaterial
              color="#E8E6E0"
              metalness={1}
              roughness={0.08}
              envMapIntensity={1.4}
            />
          </mesh>

          {/* Handle bar connecting blade to ring */}
          <mesh
            position={[side * 0.22, -0.45, 0.025]}
            rotation={[0, 0, side * 0.55]}
            castShadow
          >
            <latheGeometry args={[handleProfile, 24]} />
            <meshStandardMaterial
              color="#1A1816"
              metalness={0.4}
              roughness={0.35}
            />
          </mesh>

          {/* Finger ring */}
          <group position={[side * 0.55, -0.95, 0.025]} rotation={[0, 0, side * 0.3]}>
            <mesh castShadow>
              <torusGeometry args={[0.26, 0.045, 24, 48]} />
              <meshStandardMaterial
                color="#1A1816"
                metalness={0.5}
                roughness={0.3}
              />
            </mesh>
            {/* Inner ring highlight */}
            <mesh>
              <torusGeometry args={[0.225, 0.005, 16, 48]} />
              <meshStandardMaterial color="#B87333" metalness={1} roughness={0.2} />
            </mesh>
          </group>
        </group>
      ))}

      {/* Pivot screw */}
      <group position={[0, 0, 0.05]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.05, 32]} />
          <meshStandardMaterial color="#C9A06E" metalness={1} roughness={0.18} />
        </mesh>
        {/* Slot detail */}
        <mesh position={[0, 0.026, 0]}>
          <boxGeometry args={[0.1, 0.005, 0.015]} />
          <meshStandardMaterial color="#1A1816" metalness={0.3} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

/* ===========================================================
   COMB — beveled extrude with tapered teeth
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
      bevelSegments: 3,
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
      bevelSegments: 2,
    }),
    []
  );

  const teeth = 28;
  return (
    <group position={[0, 0.2, 0]} rotation={[0.15, 0, 0]}>
      {/* Spine */}
      <mesh castShadow position={[0, 0.15, -0.08]}>
        <extrudeGeometry args={[spineShape, spineExtrude]} />
        <meshStandardMaterial
          color="#0F0E0C"
          metalness={0.3}
          roughness={0.4}
          envMapIntensity={0.6}
        />
      </mesh>
      {/* Teeth */}
      {Array.from({ length: teeth }).map((_, i) => {
        const x = -1.0 + (i / (teeth - 1)) * 2.0;
        // Wider gap on left half (detangle), tight on right (style)
        const lenMod = i < teeth / 2 ? 1.05 : 0.95;
        return (
          <mesh key={i} position={[x, 0.1, -0.03]} castShadow>
            <extrudeGeometry args={[toothShape, toothExtrude]} />
            <meshStandardMaterial
              color="#1A1816"
              metalness={0.25}
              roughness={0.45}
            />
            <primitive object={new THREE.Object3D()} scale={[1, lenMod, 1]} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ===========================================================
   RAZOR — safety razor with knurled handle
   =========================================================== */
function Razor() {
  // Knurled handle profile (slight grooves)
  const handleProfile = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const segments = 40;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = -0.8 + t * 1.5;
      // base radius with tiny groove ripples for "knurl" look
      const r = 0.085 + Math.sin(t * Math.PI * 22) * 0.005;
      pts.push(new THREE.Vector2(r, y));
    }
    return pts;
  }, []);

  return (
    <group rotation={[0.2, 0, 0]}>
      {/* Handle */}
      <mesh castShadow>
        <latheGeometry args={[handleProfile, 48]} />
        <meshStandardMaterial
          color="#C9A06E"
          metalness={1}
          roughness={0.22}
          envMapIntensity={1.3}
        />
      </mesh>
      {/* Handle cap (bottom) */}
      <mesh position={[0, -0.85, 0]} castShadow>
        <sphereGeometry args={[0.085, 24, 24]} />
        <meshStandardMaterial color="#C9A06E" metalness={1} roughness={0.22} />
      </mesh>

      {/* Threaded neck */}
      <mesh position={[0, 0.78, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.08, 24]} />
        <meshStandardMaterial color="#7C5A3A" metalness={1} roughness={0.4} />
      </mesh>

      {/* Head base plate */}
      <RoundedBox
        args={[0.85, 0.08, 0.32]}
        radius={0.04}
        smoothness={4}
        position={[0, 0.86, 0]}
        castShadow
      >
        <meshStandardMaterial color="#C9A06E" metalness={1} roughness={0.2} />
      </RoundedBox>

      {/* Top guard */}
      <RoundedBox
        args={[0.85, 0.06, 0.18]}
        radius={0.02}
        smoothness={4}
        position={[0, 0.95, 0.08]}
        castShadow
      >
        <meshStandardMaterial color="#C9A06E" metalness={1} roughness={0.2} />
      </RoundedBox>

      {/* Blade — thin mirror sheet */}
      <mesh position={[0, 0.94, -0.02]} castShadow>
        <boxGeometry args={[0.95, 0.012, 0.28]} />
        <meshStandardMaterial
          color="#F4F2EC"
          metalness={1}
          roughness={0.03}
          envMapIntensity={2}
        />
      </mesh>
    </group>
  );
}

/* ===========================================================
   BRUSH — wooden handle, brass ferrule, fiber bristles
   =========================================================== */
function Brush() {
  const handleProfile = useMemo(() => {
    return [
      new THREE.Vector2(0.06, -1.0),
      new THREE.Vector2(0.075, -0.6),
      new THREE.Vector2(0.085, -0.2),
      new THREE.Vector2(0.09, 0.0),
      new THREE.Vector2(0.1, 0.12),
    ];
  }, []);

  return (
    <group rotation={[0.05, 0, 0]}>
      {/* Wooden handle */}
      <mesh castShadow>
        <latheGeometry args={[handleProfile, 32]} />
        <meshStandardMaterial
          color="#5C3A1E"
          metalness={0.05}
          roughness={0.72}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* Brass ferrule */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.13, 0.22, 32]} />
        <meshStandardMaterial
          color="#C9A06E"
          metalness={1}
          roughness={0.2}
          envMapIntensity={1.3}
        />
      </mesh>
      {/* Ferrule top ring */}
      <mesh position={[0, 0.34, 0]} castShadow>
        <torusGeometry args={[0.15, 0.012, 12, 32]} />
        <meshStandardMaterial color="#7C5A3A" metalness={1} roughness={0.3} />
      </mesh>

      {/* Bristle bundle — cone for natural taper */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <coneGeometry args={[0.22, 0.85, 64, 1, true]} />
        <meshStandardMaterial
          color="#F2EBDD"
          metalness={0}
          roughness={0.95}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Inner bristle for depth */}
      <mesh position={[0, 0.6, 0]} castShadow>
        <coneGeometry args={[0.18, 0.7, 32, 1, true]} />
        <meshStandardMaterial
          color="#D6CFC2"
          metalness={0}
          roughness={0.95}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ===========================================================
   POLISH BOTTLE — glass with transmission + liquid level
   =========================================================== */
function Polish() {
  return (
    <group rotation={[0.1, 0.2, 0]}>
      {/* Glass body */}
      <RoundedBox
        args={[0.7, 0.95, 0.45]}
        radius={0.06}
        smoothness={6}
        castShadow
      >
        <MeshTransmissionMaterial
          color="#F2EBDD"
          transmission={0.92}
          thickness={0.4}
          roughness={0.02}
          ior={1.45}
          chromaticAberration={0.05}
          backside
        />
      </RoundedBox>

      {/* Liquid inside — ember-coloured */}
      <RoundedBox
        args={[0.66, 0.62, 0.42]}
        radius={0.05}
        smoothness={4}
        position={[0, -0.15, 0]}
      >
        <meshStandardMaterial
          color="#7C2D12"
          metalness={0.2}
          roughness={0.25}
          transparent
          opacity={0.95}
        />
      </RoundedBox>

      {/* Label */}
      <mesh position={[0, 0, 0.231]}>
        <planeGeometry args={[0.5, 0.32]} />
        <meshStandardMaterial color="#1A1816" metalness={0.1} roughness={0.5} />
      </mesh>
      {/* Tiny "7×12" engraved feel using emissive */}
      <mesh position={[0, 0, 0.232]}>
        <planeGeometry args={[0.3, 0.06]} />
        <meshStandardMaterial
          color="#C9A06E"
          emissive="#C9A06E"
          emissiveIntensity={0.4}
          metalness={1}
          roughness={0.3}
        />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 0.56, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.16, 0.14, 24]} />
        <meshStandardMaterial color="#0F0E0C" metalness={0.3} roughness={0.5} />
      </mesh>

      {/* Cap — black with brass band */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.42, 32]} />
        <meshStandardMaterial color="#0F0E0C" metalness={0.4} roughness={0.45} />
      </mesh>
      <mesh position={[0, 0.66, 0]}>
        <torusGeometry args={[0.205, 0.015, 12, 32]} />
        <meshStandardMaterial color="#C9A06E" metalness={1} roughness={0.2} />
      </mesh>
    </group>
  );
}

/* ===========================================================
   LIPSTICK — lathe geometry tube + angled bullet
   =========================================================== */
function Lipstick() {
  const tubeProfile = useMemo(() => {
    return [
      new THREE.Vector2(0.22, -0.8),
      new THREE.Vector2(0.22, -0.3),
      new THREE.Vector2(0.21, -0.28),
      new THREE.Vector2(0.18, -0.28),
      new THREE.Vector2(0.18, 0.2),
    ];
  }, []);

  const bulletProfile = useMemo(() => {
    return [
      new THREE.Vector2(0.15, 0.2),
      new THREE.Vector2(0.15, 0.55),
      new THREE.Vector2(0.13, 0.65),
      new THREE.Vector2(0.05, 0.78),
      new THREE.Vector2(0, 0.82),
    ];
  }, []);

  return (
    <group rotation={[0.05, 0.4, -0.1]}>
      {/* Base tube — brass */}
      <mesh castShadow>
        <latheGeometry args={[tubeProfile, 48]} />
        <meshStandardMaterial
          color="#C9A06E"
          metalness={1}
          roughness={0.18}
          envMapIntensity={1.4}
        />
      </mesh>
      {/* Decorative ring */}
      <mesh position={[0, -0.3, 0]}>
        <torusGeometry args={[0.215, 0.015, 12, 48]} />
        <meshStandardMaterial color="#7C5A3A" metalness={1} roughness={0.3} />
      </mesh>

      {/* Bullet — deep ember */}
      <mesh castShadow>
        <latheGeometry args={[bulletProfile, 48]} />
        <meshStandardMaterial
          color="#7C2D12"
          metalness={0.15}
          roughness={0.35}
          envMapIntensity={0.6}
        />
      </mesh>
      {/* Bullet highlight strip */}
      <mesh position={[0, 0.5, 0.13]}>
        <planeGeometry args={[0.04, 0.4]} />
        <meshStandardMaterial
          color="#C2410C"
          emissive="#C2410C"
          emissiveIntensity={0.6}
          roughness={0.4}
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
   Animated rig — rotation + morph crossfade
   =========================================================== */
function Rig({ tool, progress }: { tool: ToolKind; progress?: number }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const targetTool = useRef<ToolKind>(tool);
  const [renderTool, setRenderTool] = useState<ToolKind>(tool);
  const morphPhase = useRef(0);
  const morphing = useRef(false);

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
    const scroll = progress ?? 0;

    const rotY = scroll * Math.PI * 2 + t * 0.18;
    group.current.rotation.y = rotY;
    group.current.rotation.x = Math.sin(t * 0.4) * 0.06 - 0.05;
    group.current.position.y = Math.sin(t * 0.55) * 0.04 - 0.2;

    if (morphing.current) {
      morphPhase.current = Math.min(1, morphPhase.current + delta * 2.2);
      const p = morphPhase.current;
      if (p < 0.5) {
        const k = 1 - p * 2;
        inner.current.scale.setScalar(k);
        inner.current.rotation.z = (1 - k) * Math.PI * 0.6;
      } else {
        if (renderTool !== targetTool.current) {
          setRenderTool(targetTool.current);
        }
        const k = (p - 0.5) * 2;
        inner.current.scale.setScalar(k);
        inner.current.rotation.z = (1 - k) * -Math.PI * 0.6;
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
      <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.3}>
        <group ref={inner}>
          <ToolComponent />
        </group>
      </Float>
    </group>
  );
}

/* ===========================================================
   Public component
   =========================================================== */
export function ToolMorph({ tool = "scissor", progress, className }: Props) {
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
        shadows
        dpr={isMobile ? [1, 1.4] : [1, 2]}
        camera={{ position: [0, 0.2, 5.2], fov: 32 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
      >
        {/* ===== 3-point cinematic lighting ===== */}
        <ambientLight intensity={0.22} color="#F2EBDD" />

        {/* Key light — warm from upper right */}
        <directionalLight
          position={[4, 5, 3]}
          intensity={2.2}
          color="#FFF4E0"
          castShadow
          shadow-mapSize-width={isMobile ? 1024 : 2048}
          shadow-mapSize-height={isMobile ? 1024 : 2048}
          shadow-bias={-0.0001}
        />

        {/* Ember rim from left */}
        <spotLight
          position={[-4, 2, -2]}
          angle={0.5}
          penumbra={0.8}
          intensity={3.5}
          color="#C2410C"
        />

        {/* Copper fill from below */}
        <pointLight position={[0, -3, 3]} intensity={1.2} color="#B87333" />

        {/* Soft top accent */}
        <pointLight position={[0, 4, -2]} intensity={0.6} color="#F2EBDD" />

        <Rig tool={tool} progress={progress} />

        <ContactShadows
          position={[0, -1.7, 0]}
          opacity={0.5}
          scale={7}
          blur={2.6}
          far={3}
          color="#000000"
        />

        {/* HDR studio environment for realistic reflections */}
        <Environment preset="studio" environmentIntensity={0.8} />

        {/* Postprocessing — subtle bloom + vignette for cinematic feel */}
        {!isMobile && (
          <EffectComposer>
            <Bloom
              intensity={0.55}
              luminanceThreshold={0.85}
              luminanceSmoothing={0.3}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.2} darkness={0.7} />
          </EffectComposer>
        )}
        {isMobile && (
          <EffectComposer>
            <Bloom
              intensity={0.35}
              luminanceThreshold={0.9}
              luminanceSmoothing={0.4}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}
