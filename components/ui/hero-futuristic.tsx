"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import * as THREE from "three/webgpu";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import {
  abs,
  blendScreen,
  float,
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
// 0.22 : la chaussure tient dans le tiers central et laisse respirer autour.
const PLANE_SCALE = 0.22;

// Profondeur : mesuré sur la depth map, le sujet s'étale de 0,553 (p5) à 0,949
// (p95). Balayer [0,1] laissait la bande traverser du vide les deux tiers du
// cycle. On balaie donc la plage où la matière existe réellement.
const DEPTH_MIN = 0.55;
const DEPTH_SPAN = 0.4;
const FLOW_WINDOW = 0.05;

// Scan-line : boîte englobante du sujet mesurée à v ∈ [0.285, 0.744] (UV three,
// flipY). On déborde à peine pour que la ligne entre et sorte proprement.
const SCAN_MIN = 0.26;
const SCAN_SPAN = 0.51;
const SCAN_WIDTH = 0.035;

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
      const flow = oneMinus(
        smoothstep(0, FLOW_WINDOW, abs(tDepthMap.sub(uProgress))),
      );
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

      // La scan-line vit dans le MATÉRIAU, plus dans le post-processing.
      // En post-processing, `uv()` est l'écran entier : la ligne balayait le vide
      // à gauche et à droite de la chaussure — un laser qui passe devant, pas un
      // scan. Ici `uv()` est l'espace du plan, et la silhouette issue de la depth
      // map coupe la ligne aux bords du sujet. Elle passe quand même dans le
      // bloom, puisque le bloom s'applique au rendu de la scène.
      const subject = smoothstep(0.05, 0.16, tDepthMap.r);
      const band = oneMinus(
        smoothstep(0, float(SCAN_WIDTH), abs(uv().y.sub(uScan))),
      );
      const scanGlow = vec3(...ACCENT_RGB).mul(band).mul(subject).mul(0.85);

      geometry = new THREE.PlaneGeometry(2, 2);
      material = new THREE.MeshBasicNodeMaterial({
        colorNode: blendScreen(tMap, mask).add(scanGlow),
        transparent: true,
        opacity: 0,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      post = new THREE.PostProcessing(renderer);
      const scenePass = pass(scene, camera);
      const scenePassColor = scenePass.getTextureNode("output");
      // Bloom seul : la scan-line est passée dans le matériau, où elle peut être
      // découpée par la silhouette. Elle traverse quand même le bloom.
      post.outputNode = scenePassColor.add(bloom(scenePassColor, 1, 0.5, 1));

      // La caméra couvre [-1,1]² quel que soit le format : un plan à échelle
      // uniforme se retrouve donc ÉTIRÉ dès que le canvas n'est pas carré — la
      // chaussure s'élargissait en paysage. On compense par la plus petite
      // dimension, ce qui garde le plan carré EN PIXELS.
      const applySize = () => {
        if (!renderer) return;
        const w = mount.clientWidth;
        const h = mount.clientHeight;
        if (w === 0 || h === 0) return;
        renderer.setSize(w, h);
        const k = Math.min(w, h);
        mesh.scale.set((PLANE_SCALE * k) / w, (PLANE_SCALE * k) / h, 1);
      };
      applySize();

      handleResize = applySize;
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
        uProgress.value = DEPTH_MIN + wave * DEPTH_SPAN;
        uScan.value = SCAN_MIN + wave * SCAN_SPAN;
        opacity = THREE.MathUtils.lerp(opacity, 1, 0.07);
        if (material) material.opacity = opacity;
        post?.renderAsync();
      };

      if (reduced) {
        // Mouvement réduit demandé : une seule frame, à l'état stable.
        // Aucune boucle n'est lancée, le GPU ne tourne pas.
        uProgress.value = DEPTH_MIN + 0.5 * DEPTH_SPAN;
        uScan.value = SCAN_MIN + 0.5 * SCAN_SPAN;
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
    <div className="pointer-events-none absolute inset-0 z-[60] flex flex-col items-center px-6 pt-[12vh]">
      {/* Voile radial, pas un aplat : le texte était posé DEVANT la chaussure et
          s'y noyait. Le bloc remonte au-dessus du sujet, et ce dégradé assombrit
          ce qui reste derrière lui sans créer de bord franc. */}
      <div
        className="absolute inset-x-0 top-0 h-[52vh]"
        style={{
          background:
            "radial-gradient(58% 68% at 50% 26%, hsl(var(--background) / 0.94) 0%, hsl(var(--background) / 0.72) 42%, transparent 76%)",
        }}
      />

      <div className="relative flex flex-col items-center">
        <div className="text-h2 font-extrabold uppercase md:text-display">
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

        {/* text-foreground : le sous-titre était en muted-foreground, illisible
            par-dessus une photo. */}
        <motion.p
          className="mt-4 max-w-md text-center text-ui font-medium text-foreground md:text-lead"
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
      </div>
    </div>
  );
}

export default HeroFuturistic;
