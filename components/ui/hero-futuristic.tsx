"use client";

import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { useAspect, useTexture } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import * as THREE from "three/webgpu";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import type { Mesh } from "three";
import {
  abs,
  blendScreen,
  float,
  mod,
  mx_cell_noise_float,
  oneMinus,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
  pass,
  mix,
  add,
} from "three/tsl";

/**
 * Hero WebGPU — composant de LABORATOIRE, monté uniquement sur /lab.
 * Il n'est référencé nulle part depuis le site.
 *
 * ── Écarts assumés par rapport au code d'origine ──────────────────────────
 * 1. Le rouge a disparu. L'original peignait la scan-line ET le masque de points
 *    en rouge (`vec3(1,0,0)` et `vec3(10,0,0)`). Dans ce produit le rouge est le
 *    verdict « contrefaçon » : il ne peut pas servir de décor. Les deux passent
 *    à l'emerald de marque. Le second n'était pas dans la liste de corrections
 *    demandée — je l'ai changé quand même, laisser un flux de points rouges
 *    aurait vidé la correction de son sens.
 * 2. Les deux images étaient hébergées sur i.postimg.cc. Téléchargées dans
 *    public/lab/ : aucun hébergeur tiers gratuit dans le chemin critique.
 * 3. Les classes explore-btn / explore-arrow / fade-in / fade-in-subtitle
 *    n'existent pas dans ce projet. Plutôt que de les écrire, la révélation mot
 *    à mot passe par framer-motion (déjà installé) et le bouton par nos tokens.
 * 4. `text-white` et `stroke="white"` deviennent `text-foreground` et
 *    `currentColor`.
 *
 * ⚠️ Ce composant suppose WebGPU disponible. La détection et le repli sont dans
 * components/lab/LabClient.tsx — il ne doit jamais être monté sans.
 */

// --accent (#10B981) en composantes normalisées : un shader ne lit pas les
// variables CSS. Toute évolution du token doit être répercutée ici.
const ACCENT_RGB: [number, number, number] = [0.0627, 0.7255, 0.5059];

const TEXTUREMAP = { src: "/lab/hero-texture.png" };
const DEPTHMAP = { src: "/lab/hero-depth.webp" };

extend(THREE as never);

const PostProcessing = ({
  strength = 1,
  threshold = 1,
  fullScreenEffect = true,
}: {
  strength?: number;
  threshold?: number;
  fullScreenEffect?: boolean;
}) => {
  const { gl, scene, camera } = useThree();
  const progressRef = useRef({ value: 0 });

  const render = useMemo(() => {
    const postProcessing = new THREE.PostProcessing(gl as never);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode("output");
    const bloomPass = bloom(scenePassColor, strength, 0.5, threshold);

    const uScanProgress = uniform(0);
    progressRef.current = uScanProgress;

    const scanPos = float(uScanProgress.value);
    const uvY = uv().y;
    const scanWidth = float(0.05);
    const scanLine = smoothstep(0, scanWidth, abs(uvY.sub(scanPos)));
    // emerald, pas rouge : le rouge est réservé au verdict « contrefaçon ».
    const scanOverlay = vec3(...ACCENT_RGB).mul(oneMinus(scanLine)).mul(0.4);

    const withScanEffect = mix(
      scenePassColor,
      add(scenePassColor, scanOverlay),
      fullScreenEffect ? smoothstep(0.9, 1.0, oneMinus(scanLine)) : 1.0,
    );

    const final = withScanEffect.add(bloomPass);
    postProcessing.outputNode = final;
    return postProcessing;
  }, [camera, gl, scene, strength, threshold, fullScreenEffect]);

  useFrame(({ clock }) => {
    progressRef.current.value =
      Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5;
    render.renderAsync();
  }, 1);

  return null;
};

const WIDTH = 300;
const HEIGHT = 300;

const Scene = () => {
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src]);
  const meshRef = useRef<Mesh>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (rawMap && depthMap) setVisible(true);
  }, [rawMap, depthMap]);

  const { material, uniforms } = useMemo(() => {
    const uPointer = uniform(new THREE.Vector2(0));
    const uProgress = uniform(0);
    const strength = 0.01;

    const tDepthMap = texture(depthMap);
    const tMap = texture(
      rawMap,
      uv().add(tDepthMap.r.mul(uPointer).mul(strength)),
    );

    const aspect = float(WIDTH).div(HEIGHT);
    const tUv = vec2(uv().x.mul(aspect), uv().y);
    const tiling = vec2(120.0);
    const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0);
    const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2));
    const dist = float(tiledUv.length());
    const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness);
    const depth = tDepthMap;
    const flow = oneMinus(smoothstep(0, 0.02, abs(depth.sub(uProgress))));
    // idem : le flux de points passe du rouge à l'emerald, même intensité (×10).
    const mask = dot
      .mul(flow)
      .mul(vec3(ACCENT_RGB[0] * 10, ACCENT_RGB[1] * 10, ACCENT_RGB[2] * 10));
    const final = blendScreen(tMap, mask);

    const material = new THREE.MeshBasicNodeMaterial({
      colorNode: final,
      transparent: true,
      opacity: 0,
    });

    return { material, uniforms: { uPointer, uProgress } };
  }, [rawMap, depthMap]);

  const [w, h] = useAspect(WIDTH, HEIGHT);

  useFrame(({ clock }) => {
    uniforms.uProgress.value =
      Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5;
    const mat = meshRef.current?.material as { opacity?: number } | undefined;
    if (mat && "opacity" in mat) {
      mat.opacity = THREE.MathUtils.lerp(mat.opacity ?? 0, visible ? 1 : 0, 0.07);
    }
  });

  useFrame(({ pointer }) => {
    uniforms.uPointer.value = pointer;
  });

  const scaleFactor = 0.4;
  return (
    <mesh
      ref={meshRef}
      scale={[w * scaleFactor, h * scaleFactor, 1]}
      material={material}
    >
      <planeGeometry />
    </mesh>
  );
};

/**
 * Surcouche texte. Les classes fade-in / fade-in-subtitle / explore-btn /
 * explore-arrow de l'original n'existent pas ici : la révélation mot à mot passe
 * par framer-motion (déjà au bundle) et le reste par les tokens.
 *
 * Textes : tu as demandé « mes textes » sans les fournir — j'ai repris la formule
 * de l'openGraph de la landing. À remplacer si ce n'est pas la bonne.
 */
function HeroOverlay() {
  const titleWords = ["Scannez", "avant", "d'acheter"];
  const subtitle = "Pré-authentification par IA en 90 secondes.";
  const reduced = useReducedMotion() ?? false;

  return (
    <div className="pointer-events-none absolute z-[60] flex h-svh w-full flex-col items-center justify-center px-10 uppercase">
      <div className="text-h2 font-extrabold md:text-display">
        <div className="flex space-x-2 overflow-hidden text-foreground lg:space-x-6">
          {titleWords.map((word, index) => (
            <motion.span
              key={word}
              initial={reduced ? undefined : { opacity: 0, y: "0.4em" }}
              animate={reduced ? undefined : { opacity: 1, y: 0 }}
              transition={{
                duration: 0.42,
                ease: [0.2, 0, 0, 1],
                delay: reduced ? 0 : 0.2 + index * 0.13,
              }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>

      <motion.p
        className="mt-2 text-ui font-bold text-muted-foreground md:text-lead"
        initial={reduced ? undefined : { opacity: 0 }}
        animate={reduced ? undefined : { opacity: 1 }}
        transition={{
          duration: 0.42,
          ease: [0.2, 0, 0, 1],
          delay: reduced ? 0 : 0.2 + titleWords.length * 0.13 + 0.2,
        }}
      >
        {subtitle}
      </motion.p>

      <motion.div
        className="absolute bottom-10 flex items-center gap-2 rounded-full border border-line-strong bg-surface/80 px-4 py-2 text-caption font-medium text-muted-foreground"
        initial={reduced ? undefined : { opacity: 0, y: 8 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.2, 0, 0, 1], delay: reduced ? 0 : 1.4 }}
      >
        Faites défiler
        <svg
          width="18"
          height="18"
          viewBox="0 0 22 22"
          fill="none"
          aria-hidden="true"
          className="text-accent"
        >
          <path d="M11 5V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M6 12L11 17L16 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.div>
    </div>
  );
}

export function HeroFuturistic() {
  return (
    <div className="relative h-svh">
      <HeroOverlay />
      <Canvas
        flat
        gl={async (props) => {
          const renderer = new THREE.WebGPURenderer(props as never);
          await renderer.init();
          return renderer;
        }}
      >
        <PostProcessing fullScreenEffect />
        <Scene />
      </Canvas>
    </div>
  );
}

export default HeroFuturistic;
