"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import * as THREE from "three/webgpu";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import {
  abs,
  add,
  blendScreen,
  float,
  mix,
  mod,
  mx_cell_noise_float,
  oneMinus,
  pass,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
} from "three/tsl";

/**
 * Hero WebGPU — three.js BRUT, sans @react-three/fiber ni @react-three/drei.
 * Composant de LABORATOIRE, monté uniquement sur /lab.
 *
 * ── Pourquoi sans react-three-fiber ───────────────────────────────────────
 * r3f v9 est la première version à accepter une factory `gl` asynchrone, ce
 * qu'exige `await renderer.init()` de WebGPURenderer. Mais v9 lit les internals
 * de React 19 et lève à l'IMPORT sur React 18 :
 *   TypeError: Cannot read properties of undefined (reading 'S')
 * Et r3f v8, compatible React 18, ignore silencieusement un `gl` async et
 * retombe sur un WebGLRenderer — on croirait tester WebGPU en testant WebGL.
 * three brut n'a aucune de ces contraintes : pas de réconciliateur, pas de
 * version de React à satisfaire.
 *
 * ── Écarts assumés par rapport au code d'origine ──────────────────────────
 * 1. Le rouge a disparu deux fois. L'original peignait la scan-line
 *    (`vec3(1,0,0)`) ET le masque de matière (`vec3(10,0,0)`) en rouge. Ici le
 *    rouge est le verdict « contrefaçon » : les deux passent à l'emerald.
 * 2. CORRECTION D'UN BUG de l'original : il écrivait
 *    `const scanPos = float(uScanProgress.value)`, ce qui capture la VALEUR (0)
 *    à la construction du graphe. L'uniform était bien mis à jour chaque frame,
 *    mais le shader ne le relisait jamais — la scan-line restait collée en y=0.
 *    On branche ici le nœud uniform lui-même, et la ligne balaie vraiment.
 * 3. Vraies photos produit dans public/lab/, optimisées en WebP 1024 :
 *    texture 1,17 Mo -> 66 Ko, depth map 659 Ko -> 19 Ko. La depth map est
 *    encodée en q95 : le flux suit ses iso-lignes de profondeur, un banding de
 *    compression s'y verrait comme des contours parasites.
 * 4. Les classes explore-btn / fade-in / fade-in-subtitle n'existent pas ici :
 *    la surcouche texte passe par framer-motion et les tokens.
 *
 * ⚠️ Ce composant suppose WebGPU disponible ET ne se monte qu'après les gardes
 * de components/lab/LabClient.tsx. Il signale ses échecs par `onError`.
 */

// --accent (#10B981) en composantes normalisées : un shader ne lit pas les
// variables CSS. Toute évolution du token doit être répercutée ici.
const ACCENT_RGB: [number, number, number] = [0.0627, 0.7255, 0.5059];

const TEXTUREMAP_SRC = "/lab/hero-texture.webp";
const DEPTHMAP_SRC = "/lab/hero-depth.webp";

const WIDTH = 300;
const HEIGHT = 300;
const PLANE_SCALE = 0.4;

type SceneCallbacks = {
  onReady?: () => void;
  onError?: (message: string) => void;
};

export function HeroFuturistic({ onReady, onError }: SceneCallbacks) {
  const hostRef = useRef<HTMLDivElement>(null);
  // Les callbacks passent par une ref : sinon une nouvelle identité à chaque
  // rendu du parent relancerait tout le montage WebGPU.
  const cbRef = useRef<SceneCallbacks>({ onReady, onError });
  cbRef.current = { onReady, onError };

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // Liaison non-nullable explicite : TypeScript perd la restriction de type
    // à travers la closure asynchrone de setup().
    const mount: HTMLDivElement = host;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let disposed = false;
    let raf = 0;
    let renderer: THREE.WebGPURenderer | null = null;
    let post: THREE.PostProcessing | null = null;
    let geometry: THREE.PlaneGeometry | null = null;
    let material: THREE.MeshBasicNodeMaterial | null = null;
    const loaded: THREE.Texture[] = [];
    let handleResize: (() => void) | null = null;
    let handlePointer: ((e: PointerEvent) => void) | null = null;
    let handleVisibility: (() => void) | null = null;

    async function setup() {
      const loader = new THREE.TextureLoader();
      const [rawMap, depthMap] = await Promise.all([
        loader.loadAsync(TEXTUREMAP_SRC),
        loader.loadAsync(DEPTHMAP_SRC),
      ]);
      if (disposed) {
        rawMap.dispose();
        depthMap.dispose();
        return;
      }
      loaded.push(rawMap, depthMap);

      const r = new THREE.WebGPURenderer({ antialias: true, alpha: true });
      // Le seul appel impossible en r3f v8, et la raison de cette réécriture.
      await r.init();
      if (disposed) {
        r.dispose();
        return;
      }
      renderer = r;

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.domElement.style.display = "block";
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      // Caméra orthographique en coordonnées normalisées : le plan couvre
      // exactement [-1,1]² quel que soit le format du canvas, donc un
      // redimensionnement ne demande qu'un setSize.
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
      camera.position.z = 1;

      const uPointer = uniform(new THREE.Vector2(0, 0));
      const uProgress = uniform(0);
      const uScan = uniform(0);

      const tDepthMap = texture(depthMap);
      const tMap = texture(
        rawMap,
        uv().add(tDepthMap.r.mul(uPointer).mul(0.01)),
      );

      const aspect = float(WIDTH).div(HEIGHT);
      const tUv = vec2(uv().x.mul(aspect), uv().y);
      const tiling = vec2(120.0);
      const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0);
      const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2));
      const dist = float(tiledUv.length());
      const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness);
      // Fenêtre de flux à 0.02, valeur d'origine — premier essai demandé.
      // Mesuré sur cette depth map : le sujet occupe 27,5 % de l'image et sa
      // profondeur s'étale de 0,553 (p5) à 0,949 (p95). uProgress balayant [0,1]
      // en sinusoïde, la bande ne croise donc la chaussure que ~32 % du cycle —
      // voir le message qui accompagne ce commit.
      const flow = oneMinus(smoothstep(0, 0.02, abs(tDepthMap.sub(uProgress))));
      // emerald, pas rouge : le rouge est le verdict « contrefaçon ».
      const mask = dot
        .mul(flow)
        .mul(
          vec3(
            ACCENT_RGB[0] * 10,
            ACCENT_RGB[1] * 10,
            ACCENT_RGB[2] * 10,
          ),
        );

      geometry = new THREE.PlaneGeometry(2, 2);
      material = new THREE.MeshBasicNodeMaterial({
        colorNode: blendScreen(tMap, mask),
        transparent: true,
        opacity: 0,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.scale.set(PLANE_SCALE, PLANE_SCALE, 1);
      scene.add(mesh);

      post = new THREE.PostProcessing(renderer);
      const scenePass = pass(scene, camera);
      const scenePassColor = scenePass.getTextureNode("output");
      const bloomPass = bloom(scenePassColor, 1, 0.5, 1);

      // uScan (le NŒUD), pas uScan.value : c'est le correctif du bug d'origine.
      const scanLine = smoothstep(0, float(0.05), abs(uv().y.sub(uScan)));
      const scanOverlay = vec3(...ACCENT_RGB).mul(oneMinus(scanLine)).mul(0.4);
      const withScan = mix(
        scenePassColor,
        add(scenePassColor, scanOverlay),
        smoothstep(0.9, 1.0, oneMinus(scanLine)),
      );
      post.outputNode = withScan.add(bloomPass);

      handleResize = () => {
        if (!renderer) return;
        renderer.setSize(mount.clientWidth, mount.clientHeight);
      };
      window.addEventListener("resize", handleResize);

      // Pointeur suivi par un listener natif — normalisé comme le faisait r3f :
      // x et y dans [-1, 1], y vers le haut.
      handlePointer = (e: PointerEvent) => {
        uPointer.value.set(
          (e.clientX / window.innerWidth) * 2 - 1,
          -(e.clientY / window.innerHeight) * 2 + 1,
        );
      };
      window.addEventListener("pointermove", handlePointer, { passive: true });

      const clock = new THREE.Clock();
      let opacity = 0;

      const drawFrame = () => {
        const t = clock.getElapsedTime();
        const wave = Math.sin(t * 0.5) * 0.5 + 0.5;
        uProgress.value = wave;
        uScan.value = wave;
        opacity = THREE.MathUtils.lerp(opacity, 1, 0.07);
        if (material) material.opacity = opacity;
        post?.renderAsync();
      };

      if (reduced) {
        // Mouvement réduit demandé : une seule frame, à l'état stable.
        // Aucune boucle n'est lancée, le GPU ne tourne pas.
        uProgress.value = 0.5;
        uScan.value = 0.5;
        material.opacity = 1;
        post.renderAsync();
        cbRef.current.onReady?.();
        return;
      }

      const loop = () => {
        drawFrame();
        raf = requestAnimationFrame(loop);
      };

      // Onglet caché : on arrête la boucle. Faire tourner un GPU en arrière-plan
      // ne sert à rien et chauffe le téléphone en silence.
      handleVisibility = () => {
        if (document.hidden) {
          cancelAnimationFrame(raf);
          raf = 0;
        } else if (raf === 0 && !disposed) {
          clock.getDelta(); // absorbe le temps écoulé pendant la pause
          raf = requestAnimationFrame(loop);
        }
      };
      document.addEventListener("visibilitychange", handleVisibility);

      if (!document.hidden) raf = requestAnimationFrame(loop);
      cbRef.current.onReady?.();
    }

    setup().catch((err: unknown) => {
      if (disposed) return;
      cbRef.current.onError?.(
        err instanceof Error ? err.message : String(err),
      );
    });

    return () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      if (handleResize) window.removeEventListener("resize", handleResize);
      if (handlePointer) window.removeEventListener("pointermove", handlePointer);
      if (handleVisibility)
        document.removeEventListener("visibilitychange", handleVisibility);

      // Ordre volontaire : les ressources GPU d'abord, le renderer ensuite.
      // Une fuite three sur un démontage ne se voit pas — elle fait juste
      // chauffer l'appareil.
      post?.dispose();
      material?.dispose();
      geometry?.dispose();
      loaded.forEach((t) => t.dispose());
      const canvas = renderer?.domElement;
      renderer?.dispose();
      if (canvas?.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, []);

  return (
    <div className="relative h-svh">
      <HeroOverlay />
      <div ref={hostRef} className="h-svh w-full" />
    </div>
  );
}

/**
 * Surcouche texte.
 */
function HeroOverlay() {
  const titleWords = ["Vrai", "ou", "faux"];
  const subtitle = "Pré-authentification par IA en 90 secondes";
  const reduced = useReducedMotion() ?? false;

  return (
    <div className="pointer-events-none absolute inset-0 z-[60] flex flex-col items-center justify-center px-10 uppercase">
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

export default HeroFuturistic;
