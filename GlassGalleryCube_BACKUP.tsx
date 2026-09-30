import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { useLenis } from "lenis/react";

// The exact 24 images from the Framer Glass Gallery Cube demo
export const FRAMER_IMAGES = [
  "https://framerusercontent.com/images/GKQ0vM7jStrNTZG4aApwNMqsBJ4.png?width=2363&height=2395",
  "https://framerusercontent.com/images/d9sAAWchzbCsHPV3SuG9sZWu8.png?width=840&height=1200",
  "https://framerusercontent.com/images/hZs8JIQd5HgOLwzWQar0dmg66c.png?width=1800&height=2400",
  "https://framerusercontent.com/images/YlfbJWQG8IbSBY1CmpbeTgJKk.png?width=1698&height=2380",
  "https://framerusercontent.com/images/Ugdn4VT3UsvhYdNd9fvYDwAsT5g.png?width=1808&height=2400",
  "https://framerusercontent.com/images/fAeCoyBCaDa2w67xJcc3XN1zE.png?width=1920&height=2400",
  "https://framerusercontent.com/images/SlwryIVu875mhYHtLgHE.png?width=1922&height=2400",
  "https://framerusercontent.com/images/kIeri1lShk9160tmhJEALC4ASu0.png?width=1600&height=2400",
  "https://framerusercontent.com/images/lBqoGISzctD6sIlieMKDaaGNIw.png?width=1800&height=2400",
  "https://framerusercontent.com/images/9IJApNPaVqzz7fSiuEUsvEyaq0.png?width=1600&height=2400",
  "https://framerusercontent.com/images/4RvseBwImrPj9bn9zOnp8f366Y.png?width=1680&height=2400",
  "https://framerusercontent.com/images/3reGuWpWiARbmfYlToDFtUzhTc.png?width=1600&height=2400",
  "https://framerusercontent.com/images/2EmRiDgE91kB4AaZyfzBxTQxo.png?width=1800&height=2400",
  "https://framerusercontent.com/images/YfZICHUvj4tM9KChHBFGS2kyRcM.png?width=1984&height=2400",
  "https://framerusercontent.com/images/kXfuE3uomymJSEm5kWosndUuniw.png?width=1808&height=2400",
  "https://framerusercontent.com/images/PBaH4eglgI7GUDyM1uwwcsPZCg.png?width=1800&height=2400",
  "https://framerusercontent.com/images/Zjl31xWX2hE9m88WsBGZEEl28.png?width=1200&height=1200",
  "https://framerusercontent.com/images/Pe4aZvclq17Pwqheo2k6n3rCuvM.png?width=840&height=1200",
  "https://framerusercontent.com/images/pxmshcYuJwnsGLH5a7OMsiGrqaU.png?width=1920&height=2400",
  "https://framerusercontent.com/images/Eub7LWxRDx5Y1jfMeApvis2A5M.png?width=1200&height=1200",
  "https://framerusercontent.com/images/wEMoHl4xz5rT1wBnf9T5Psn3aak.png?width=1808&height=2400",
  "https://framerusercontent.com/images/5vX9PCkxBCyw6PLyrl2hBa6BYUM.png?width=1808&height=2400",
  "https://framerusercontent.com/images/xbLoKT15B9R3aRsZULXO3FUlzc.png?width=1200&height=1200",
  "https://framerusercontent.com/images/XeFIDQri6EO94GvRr1iR9pbAFBQ.png?width=1920&height=2400"
];

interface GlassGalleryCubeProps {
  images?: string[];
  mode?: "square" | "rect" | "quad";
  cubeSize?: number;
  autoSpinSpeed?: number;
  scrollSpins?: number;
  mouseTiltIntensity?: number;
  backgroundColor?: string;
  photoOpacity?: number;
  glassThickness?: number;
  glassRoughness?: number;
  glassOpacity?: number;
  glassColor?: string;
  galleryItemWidth?: number;
  galleryItemHeight?: number;
  gridGapX?: number;
  gridGapY?: number;
}

function computeFaceConfigs(
  mode: "square" | "rect" | "quad" = "quad",
  cubeSize: number = 0.95,
  itemWidth?: number,
  itemHeight?: number,
  gapX?: number,
  gapY?: number
) {
  const eT = Math.PI / 2;
  const o = 0.715 * cubeSize;
  const s = 1.51 * cubeSize;
  const c = [2.8 * cubeSize, 1.37 * cubeSize];
  const l = [2.8 * cubeSize, 2.8 * cubeSize];
  const u = [1.37 * cubeSize, 1.37 * cubeSize];
  let d: any[] = [];

  if (mode === "square") {
    d = [
      { basePos: [-s, 0, 0], baseRot: [0, -eT, 0], foldedScale: l, texIndex: 0, col: 0, row: 0, cols: 3, rows: 2 },
      { basePos: [0, 0, s], baseRot: [0, 0, 0], foldedScale: l, texIndex: 1, col: 1, row: 0, cols: 3, rows: 2 },
      { basePos: [s, 0, 0], baseRot: [0, eT, 0], foldedScale: l, texIndex: 2, col: 2, row: 0, cols: 3, rows: 2 },
      { basePos: [0, 0, -s], baseRot: [0, Math.PI, 0], foldedScale: l, texIndex: 3, col: 0, row: 1, cols: 3, rows: 2 },
      { basePos: [0, s, 0], baseRot: [-eT, 0, 0], foldedScale: l, texIndex: 4, col: 1, row: 1, cols: 3, rows: 2 },
      { basePos: [0, -s, 0], baseRot: [eT, 0, 0], foldedScale: l, texIndex: 5, col: 2, row: 1, cols: 3, rows: 2 }
    ];
  } else if (mode === "rect") {
    d = [
      { basePos: [-s, +o, 0], baseRot: [0, -eT, 0], foldedScale: c, texIndex: 0, col: 0, row: 0, cols: 6, rows: 2 },
      { basePos: [-s, -o, 0], baseRot: [0, -eT, 0], foldedScale: c, texIndex: 6, col: 0, row: 1, cols: 6, rows: 2 },
      { basePos: [0, +o, s], baseRot: [0, 0, 0], foldedScale: c, texIndex: 1, col: 1, row: 0, cols: 6, rows: 2 },
      { basePos: [0, -o, s], baseRot: [0, 0, 0], foldedScale: c, texIndex: 7, col: 1, row: 1, cols: 6, rows: 2 },
      { basePos: [s, +o, 0], baseRot: [0, eT, 0], foldedScale: c, texIndex: 2, col: 2, row: 0, cols: 6, rows: 2 },
      { basePos: [s, -o, 0], baseRot: [0, eT, 0], foldedScale: c, texIndex: 8, col: 2, row: 1, cols: 6, rows: 2 },
      { basePos: [0, +o, -s], baseRot: [0, Math.PI, 0], foldedScale: c, texIndex: 3, col: 3, row: 0, cols: 6, rows: 2 },
      { basePos: [0, -o, -s], baseRot: [0, Math.PI, 0], foldedScale: c, texIndex: 9, col: 3, row: 1, cols: 6, rows: 2 },
      { basePos: [0, s, -o], baseRot: [-eT, 0, 0], foldedScale: c, texIndex: 4, col: 4, row: 0, cols: 6, rows: 2 },
      { basePos: [0, s, +o], baseRot: [-eT, 0, 0], foldedScale: c, texIndex: 10, col: 4, row: 1, cols: 6, rows: 2 },
      { basePos: [0, -s, +o], baseRot: [eT, 0, 0], foldedScale: c, texIndex: 5, col: 5, row: 0, cols: 6, rows: 2 },
      { basePos: [0, -s, -o], baseRot: [eT, 0, 0], foldedScale: c, texIndex: 11, col: 5, row: 1, cols: 6, rows: 2 }
    ];
  } else {
    d = [
      { basePos: [-s, +o, -o], baseRot: [0, -eT, 0], foldedScale: u, texIndex: 0, col: 0, row: 0, cols: 8, rows: 3 },
      { basePos: [-s, -o, -o], baseRot: [0, -eT, 0], foldedScale: u, texIndex: 12, col: 0, row: 2, cols: 8, rows: 3 },
      { basePos: [-s, +o, +o], baseRot: [0, -eT, 0], foldedScale: u, texIndex: 1, col: 1, row: 0, cols: 8, rows: 3 },
      { basePos: [-s, -o, +o], baseRot: [0, -eT, 0], foldedScale: u, texIndex: 13, col: 1, row: 2, cols: 8, rows: 3 },
      { basePos: [-o, +o, s], baseRot: [0, 0, 0], foldedScale: u, texIndex: 2, col: 2, row: 0, cols: 8, rows: 3 },
      { basePos: [-o, -o, s], baseRot: [0, 0, 0], foldedScale: u, texIndex: 14, col: 2, row: 2, cols: 8, rows: 3 },
      { basePos: [+o, +o, s], baseRot: [0, 0, 0], foldedScale: u, texIndex: 3, col: 3, row: 0, cols: 8, rows: 3 },
      { basePos: [+o, -o, s], baseRot: [0, 0, 0], foldedScale: u, texIndex: 15, col: 3, row: 2, cols: 8, rows: 3 },
      { basePos: [s, +o, +o], baseRot: [0, eT, 0], foldedScale: u, texIndex: 4, col: 4, row: 0, cols: 8, rows: 3 },
      { basePos: [s, -o, +o], baseRot: [0, eT, 0], foldedScale: u, texIndex: 16, col: 4, row: 2, cols: 8, rows: 3 },
      { basePos: [s, +o, -o], baseRot: [0, eT, 0], foldedScale: u, texIndex: 5, col: 5, row: 0, cols: 8, rows: 3 },
      { basePos: [s, -o, -o], baseRot: [0, eT, 0], foldedScale: u, texIndex: 17, col: 5, row: 2, cols: 8, rows: 3 },
      { basePos: [+o, +o, -s], baseRot: [0, Math.PI, 0], foldedScale: u, texIndex: 6, col: 6, row: 0, cols: 8, rows: 3 },
      { basePos: [+o, -o, -s], baseRot: [0, Math.PI, 0], foldedScale: u, texIndex: 18, col: 6, row: 2, cols: 8, rows: 3 },
      { basePos: [-o, +o, -s], baseRot: [0, Math.PI, 0], foldedScale: u, texIndex: 7, col: 7, row: 0, cols: 8, rows: 3 },
      { basePos: [-o, -o, -s], baseRot: [0, Math.PI, 0], foldedScale: u, texIndex: 19, col: 7, row: 2, cols: 8, rows: 3 },
      { basePos: [-o, s, -o], baseRot: [-eT, 0, 0], foldedScale: u, texIndex: 8, col: 0, row: 1, cols: 8, rows: 3 },
      { basePos: [-o, s, +o], baseRot: [-eT, 0, 0], foldedScale: u, texIndex: 20, col: 1, row: 1, cols: 8, rows: 3 },
      { basePos: [+o, s, -o], baseRot: [-eT, 0, 0], foldedScale: u, texIndex: 9, col: 2, row: 1, cols: 8, rows: 3 },
      { basePos: [+o, s, +o], baseRot: [-eT, 0, 0], foldedScale: u, texIndex: 21, col: 3, row: 1, cols: 8, rows: 3 },
      { basePos: [-o, -s, +o], baseRot: [eT, 0, 0], foldedScale: u, texIndex: 10, col: 4, row: 1, cols: 8, rows: 3 },
      { basePos: [-o, -s, -o], baseRot: [eT, 0, 0], foldedScale: u, texIndex: 22, col: 5, row: 1, cols: 8, rows: 3 },
      { basePos: [+o, -s, +o], baseRot: [eT, 0, 0], foldedScale: u, texIndex: 11, col: 6, row: 1, cols: 8, rows: 3 },
      { basePos: [+o, -s, -o], baseRot: [eT, 0, 0], foldedScale: u, texIndex: 23, col: 7, row: 1, cols: 8, rows: 3 }
    ];
  }

  const f = gapX ?? 0.3;
  const p = gapY ?? 0.3;
  const m = d[0]?.cols || 1;
  const h = d[0]?.rows || 1;

  return d.map((item) => {
    const t = itemWidth ?? 1.9;
    const i = itemHeight ?? 1.9;
    const a = -((m - 1) * (t + f)) / 2;
    const oY = ((h - 1) * (i + p)) / 2;
    return {
      ...item,
      flatScale: [t, i],
      flatPos: [a + item.col * (t + f), oY - item.row * (i + p), 0]
    };
  });
}

export const GlassGalleryCube: React.FC<GlassGalleryCubeProps> = ({
  images = FRAMER_IMAGES,
  mode = "quad",
  cubeSize = 0.95,
  autoSpinSpeed = 0.6,
  scrollSpins = 1,
  mouseTiltIntensity = 2.5,
  backgroundColor = "#000000",
  photoOpacity = 0.92,
  glassThickness = 4.5,
  glassRoughness = 0.12,
  glassOpacity = 0.18,
  glassColor = "#ffffff",
  galleryItemWidth = 1.9,
  galleryItemHeight = 1.9,
  gridGapX = 0.3,
  gridGapY = 0.3
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<number>(0);

  // Sync scroll with Lenis without any DOM-mutating pin-spacers
  useLenis(({ scroll }) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const height = container.offsetHeight;
    const vh = window.innerHeight;
    const maxScroll = height - vh;

    if (maxScroll > 0) {
      const prog = Math.min(1, Math.max(0, (scroll - top) / maxScroll));
      scrollProgressRef.current = prog;
      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = Math.max(0, 1 - prog * 4.5).toString();
      }
    }
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // 1. Three.js Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 6.6;

    // 2. High Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 3. Scene Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(-8, 10, -2);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight2.position.set(8, -5, 6);
    scene.add(dirLight2);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 0.4));

    const coreLight = new THREE.PointLight(0xffffff, 0, 10, 1.6);
    scene.add(coreLight);

    const group = new THREE.Group();
    scene.add(group);

    // 4. Physical Glass Cube Mesh
    const glassGeom = new THREE.BoxGeometry(3.02 * cubeSize, 3.02 * cubeSize, 3.02 * cubeSize);
    const glassMat = new THREE.MeshPhysicalMaterial({
      transmission: 1,
      roughness: glassRoughness,
      thickness: glassThickness,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      ior: 1.45,
      color: new THREE.Color(glassColor),
      transparent: true,
      opacity: glassOpacity,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const glassMesh = new THREE.Mesh(glassGeom, glassMat);
    group.add(glassMesh);

    // 5. Build 24 Textured Photo Panels
    const configs = computeFaceConfigs(mode, cubeSize, galleryItemWidth, galleryItemHeight, gridGapX, gridGapY);
    const textureLoader = new THREE.TextureLoader();
    const textureCache = new Map<string, THREE.Texture>();
    const geomCache = new Map<string, THREE.PlaneGeometry>();
    const faceMeshes: Array<{ mesh: THREE.Mesh; material: THREE.MeshPhysicalMaterial; config: any }> = [];

    const activeList = Array.from({ length: 24 }, (_, i) => images[i % images.length]);

    for (const conf of configs) {
      const url = activeList[conf.texIndex];
      let tex: THREE.Texture;
      if (textureCache.has(url)) {
        tex = textureCache.get(url)!;
      } else {
        tex = textureLoader.load(url);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = true;
        textureCache.set(url, tex);
      }

      const geomKey = `${conf.foldedScale[0]}:${conf.foldedScale[1]}`;
      let planeGeom: THREE.PlaneGeometry;
      if (geomCache.has(geomKey)) {
        planeGeom = geomCache.get(geomKey)!;
      } else {
        planeGeom = new THREE.PlaneGeometry(conf.foldedScale[0], conf.foldedScale[1]);
        geomCache.set(geomKey, planeGeom);
      }

      const planeMat = new THREE.MeshPhysicalMaterial({
        map: tex,
        emissiveMap: tex,
        emissive: new THREE.Color(0xffffff),
        transparent: true,
        opacity: photoOpacity,
        side: THREE.DoubleSide,
        roughness: 1,
        metalness: 0,
        clearcoat: 0,
        clearcoatRoughness: 0.25,
        depthWrite: true,
        toneMapped: false
      });

      const mesh = new THREE.Mesh(planeGeom, planeMat);
      mesh.position.set(conf.basePos[0], conf.basePos[1], conf.basePos[2]);
      mesh.rotation.set(conf.baseRot[0], conf.baseRot[1], conf.baseRot[2]);
      group.add(mesh);

      faceMeshes.push({ mesh, material: planeMat, config: conf });
    }

    const rows = mode === "quad" ? 3 : 2;
    const rowH = galleryItemHeight ?? 1.9;
    const gapH = gridGapY ?? 0.3;
    const totalGridHeight = rows * rowH + (rows - 1) * gapH;
    const unfoldEnd = 0.95;

    // 6. Mouse & Pointer Tracking
    const pointer = { x: 0, y: 0 };
    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener("mousemove", onPointerMove);

    // 7. Resize Handler
    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    // 8. Continuous Animation Loop
    let h = 0;
    let g = 0;
    let lastRotY = 0;
    let hasSpun = false;
    let lastTime = performance.now();
    let isRunning = true;
    let rafId: number;

    const renderLoop = (time: number) => {
      if (!isRunning) return;

      const dt = Math.min(0.1, (time - lastTime) / 1000);
      lastTime = time;
      const step = dt * 60;

      const u = 1 - Math.exp(-0.12 * step);
      const p = 1 - Math.exp(-0.08 * step);
      const m = 1 - Math.exp(-0.15 * step);

      g += (scrollProgressRef.current - g) * u;
      const S = 1 - Math.min(1, g / unfoldEnd);

      if (scrollProgressRef.current === 0) {
        if (hasSpun) {
          h = group.rotation.y / Math.max(0.01, autoSpinSpeed);
          hasSpun = false;
        }
        h += dt;
      } else if (!hasSpun) {
        const normY = ((group.rotation.y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        group.rotation.y = normY;
        lastRotY = normY;
        hasSpun = true;
      }

      // Smooth Easing Interpolation
      const E = 0.5 * (1 - Math.cos(S * Math.PI));
      const targetRotX = (0.35 + 0.1 * Math.sin(h * 0.5) - pointer.y * mouseTiltIntensity) * E;
      const targetRotY = scrollProgressRef.current === 0
        ? h * autoSpinSpeed + pointer.x * mouseTiltIntensity
        : (lastRotY + pointer.x * mouseTiltIntensity) * E + (1 - E) * (scrollSpins * Math.PI * 2);
      const targetRotZ = (0.2 + 0.08 * Math.cos(h * 0.4)) * E;

      group.rotation.x += (targetRotX - group.rotation.x) * p;
      group.rotation.y += (targetRotY - group.rotation.y) * p;
      group.rotation.z += (targetRotZ - group.rotation.z) * p;

      const aspect = camera.aspect;
      const responsiveAspect = aspect < 1 ? Math.max(0.65, aspect) : 1;
      const targetScale = (0.55 + 0.45 * S) * responsiveAspect;
      const nextScale = group.scale.x + (targetScale - group.scale.x) * u;
      group.scale.set(nextScale, nextScale, nextScale);

      // Vertical auto centering in grid phase
      const fovRad = (camera.fov * Math.PI) / 180;
      const viewH = 2 * Math.tan(fovRad / 2) * Math.abs(camera.position.z);
      const maxShift = Math.max(0, totalGridHeight * nextScale - viewH);
      let targetPosY = 0;
      if (g >= unfoldEnd && unfoldEnd < 0.99) {
        const mid = unfoldEnd + (1 - unfoldEnd) * 0.25;
        targetPosY = g < mid
          ? ((g - unfoldEnd) / Math.max(0.001, mid - unfoldEnd)) * (-maxShift / 2)
          : -maxShift / 2 + ((g - mid) / Math.max(0.001, 1 - mid)) * maxShift;
      }
      group.position.y += (targetPosY - group.position.y) * u;

      // Glass Material Translucency
      const targetGlassOpacity = scrollProgressRef.current === 0 ? glassOpacity : 0;
      glassMat.opacity += (targetGlassOpacity - glassMat.opacity) * m;
      const currentGlassScale = 0.001 + 0.999 * S;
      glassMesh.scale.set(currentGlassScale, currentGlassScale, currentGlassScale);
      coreLight.intensity = 5 * S;

      // Unfold Mesh Panels (3D Cube -> Flat 8x3 Grid)
      for (let i = 0; i < faceMeshes.length; i++) {
        const { mesh, material, config } = faceMeshes[i];
        const posX = (1 - S) * config.flatPos[0] + S * config.basePos[0];
        const posY = (1 - S) * config.flatPos[1] + S * config.basePos[1];
        const posZ = (1 - S) * config.flatPos[2] + S * config.basePos[2];

        mesh.position.x += (posX - mesh.position.x) * u;
        mesh.position.y += (posY - mesh.position.y) * u;
        mesh.position.z += (posZ - mesh.position.z) * u;

        const scaleX = (1 - S) * (config.flatScale[0] / config.foldedScale[0]) + S;
        const scaleY = (1 - S) * (config.flatScale[1] / config.foldedScale[1]) + S;
        mesh.scale.set(scaleX, scaleY, 1);

        mesh.rotation.x += (config.baseRot[0] * S - mesh.rotation.x) * u;
        mesh.rotation.y += (config.baseRot[1] * S - mesh.rotation.y) * u;
        mesh.rotation.z += (config.baseRot[2] * S - mesh.rotation.z) * u;

        const targetPhotoOpacity = 1 - (1 - photoOpacity) * S;
        material.opacity += (targetPhotoOpacity - material.opacity) * m;
        material.color.setRGB(S, S, S);
        material.emissive.setRGB(1 - S, 1 - S, 1 - S);
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(renderLoop);
    };

    rafId = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      scene.clear();
      textureCache.forEach((t) => t.dispose());
      geomCache.forEach((g) => g.dispose());
    };
  }, [
    images,
    mode,
    cubeSize,
    autoSpinSpeed,
    scrollSpins,
    mouseTiltIntensity,
    photoOpacity,
    glassThickness,
    glassRoughness,
    glassOpacity,
    glassColor,
    galleryItemWidth,
    galleryItemHeight,
    gridGapX,
    gridGapY
  ]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "250vh",
        backgroundColor,
        position: "relative"
      }}
    >
      {/* Sticky Native Viewport with zero layout shift */}
      <div
        style={{
          position: "sticky",
          top: 0,
          width: "100%",
          height: "100vh",
          overflow: "hidden"
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            outline: "none"
          }}
        />

        {/* Minimalist "Scroll to Disintegrate" indicator from Framer */}
        <div
          ref={scrollHintRef}
          data-gg-scroll-hint=""
          style={{
            position: "absolute",
            bottom: 40,
            right: 40,
            zIndex: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
            pointerEvents: "none",
            color: "rgba(255,255,255,0.4)",
            fontFamily: "monospace",
            fontSize: 9,
            textTransform: "uppercase",
            letterSpacing: "0.4em",
            transition: "opacity 0.3s ease"
          }}
        >
          <span style={{ animation: "gg-pulse 2s cubic-bezier(0.4,0,0.6,1) infinite" }}>
            Scroll to Disintegrate
          </span>
          <div
            style={{
              width: 1,
              height: 40,
              background: "rgba(255,255,255,0.1)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: "50%",
                background: "white",
                animation: "gg-bounce 2s infinite ease-in-out"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlassGalleryCube;
