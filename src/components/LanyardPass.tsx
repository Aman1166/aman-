import { useEffect, useMemo, useRef, useState, startTransition } from "react";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";

const FONT = '"Inter", "Helvetica Neue", Helvetica, Arial, sans-serif';
const SWING_STRENGTH = 1;
const PAPER = "#0e1014";
const INK = "#FFFFFF";
const ACCENT = "#38bdf8";
const STRAP = "#18181b";
const DEMO_PHOTO = "/aman.jpg";
const PAD_MIN = 28;
const PAD_MAX = 88;
const NAME_MIN = 48;
const NAME_MAX = 140;
const META_MIN = 14;
const META_MAX = 36;
const NUM_MIN = 24;
const NUM_MAX = 96;
const PRINT_PAD = 44;
const CARD_DEPTH = 0.1;
const MM_PER_UNIT = 54;
const THICK_MIN = 0.8;
const THICK_MAX = 12;
const THICK_DEFAULT = Math.round(CARD_DEPTH * MM_PER_UNIT * 10) / 10;
const SIZE_MIN = 240;
const SIZE_MAX = 560;
const NARROW_AT = 420;
const JOINTS = 3;
const SEG_LEN = 0.82;
const CARD_W = 1.58;
const CARD_H = 2.12;
const SLEEVE_PAD_W = 0.08;
const SLEEVE_LIP = 0.05;
const SLEEVE_HEAD = 0.16;
const SLEEVE_PAD_H = SLEEVE_LIP + SLEEVE_HEAD;
const SLEEVE_PAD_D = 0.03;
const SLEEVE_SHIFT = (SLEEVE_HEAD - SLEEVE_LIP) / 2;
const HOLE = 0.09;
const ROPE_ITERS = 18;
const GRAVITY = -22;
const AIR = 0.986;
const DT = 1 / 60;
const STRAP_SEGS = 40;
const STRAP_RADIAL = 10;
const STRAP_HALF_W = 0.07;
const STRAP_HALF_T = 0.02;
const CORD_R = 0.032;
const CORD_REPEAT = 14;
const TEX_W = 1024;
const TEX_H = 1365;
const STRAP_TEX_W = 256;
const STRAP_TEX_H = 1024;
const STRAP_REPEAT = 3;
const CAM_X = 0.7;
const CAM_Y = -0.7;
const CAM_Z = 7.1;
const CAM_LOOK_Y = -1.05;
const IDLE_SPRING = 6;
const IDLE_DAMP = 0.9;

export interface LanyardPassProps {
  content?: {
    attendeeName?: string;
    ticketType?: string;
    ticketNumber?: string;
    eventName?: string;
    eventDate?: string;
    barcodeValue?: string;
    backText?: string;
    strapText?: string;
    backLine?: string;
  };
  look?: {
    paper?: string;
    ink?: string;
    accent?: string;
    strapColor?: string;
    strapStyle?: "flat" | "cord";
    foil?: boolean | "off" | "edges" | "marks+edges" | "marks";
    photoFit?: "cover" | "inset";
    finish?: "gloss" | "matte" | "linen";
    sleeve?: boolean;
    sleeveTexture?: "clear" | "frosted" | "textured";
    logo?: string | null;
    photo?: string | null;
    backArt?: string | null;
    nameFont?: any;
    metaFont?: any;
    numberFont?: any;
  };
  light?: {
    angle?: number;
    height?: number;
    intensity?: number;
    rim?: boolean;
  };
  layout?: {
    size?: number;
    padding?: number;
    stackGap?: number;
    thickness?: number;
  };
  motion?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const DEFAULT_CONTENT = {
  attendeeName: "Aman Roney",
  ticketType: "Frontend Web Developer",
  ticketNumber: "DEV-2026",
  eventName: "PORTFOLIO PASS",
  eventDate: "ALWAR, RJ",
  barcodeValue: "AMANRONEYDEV",
  backText: "",
  strapText: "AMAN RONEY · FRONTEND DEVELOPER",
  backLine: "DEV-2026"
};

const DEFAULT_NAME_FONT = {
  fontSize: "96px",
  fontWeight: 700,
  fontStyle: "normal",
  letterSpacing: "-0.045em",
  lineHeight: "1em",
};

const DEFAULT_META_FONT = {
  fontSize: "22px",
  fontWeight: 500,
  fontStyle: "normal",
  letterSpacing: "0.01em",
  lineHeight: "1.2em",
};

const DEFAULT_NUMBER_FONT = {
  fontSize: "44px",
  fontWeight: 700,
  fontStyle: "normal",
  letterSpacing: "-0.04em",
  lineHeight: "1em",
};

const DEFAULT_LOOK = {
  paper: PAPER,
  ink: INK,
  accent: ACCENT,
  strapColor: STRAP,
  strapStyle: "flat" as const,
  foil: true,
  photoFit: "cover" as const,
  finish: "gloss" as const,
  sleeve: true,
  sleeveTexture: "clear" as const,
  nameFont: DEFAULT_NAME_FONT,
  metaFont: DEFAULT_META_FONT,
  numberFont: DEFAULT_NUMBER_FONT,
};

const DEFAULT_LIGHT = {
  angle: 25,
  height: 55,
  intensity: 1.1,
  rim: true,
};

const TYPE_GAP_MIN = 8;
const TYPE_GAP_MAX = 48;
const TYPE_GAP_DEFAULT = 12;

const DEFAULT_LAYOUT = {
  size: 360,
  padding: PRINT_PAD,
  stackGap: TYPE_GAP_DEFAULT,
  thickness: THICK_DEFAULT,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function clampSize(value: number) {
  if (!Number.isFinite(value)) return DEFAULT_LAYOUT.size;
  return Math.round(clamp(value, SIZE_MIN, SIZE_MAX));
}

function clampPad(value: number) {
  if (!Number.isFinite(value)) return DEFAULT_LAYOUT.padding;
  return Math.round(clamp(value, PAD_MIN, PAD_MAX));
}

function clampStackGap(value: number) {
  if (!Number.isFinite(value)) return DEFAULT_LAYOUT.stackGap;
  return Math.round(clamp(value, TYPE_GAP_MIN, TYPE_GAP_MAX));
}

function asText(value: any) {
  return typeof value === "string" ? value : "";
}

function visibleText(value: any) {
  const text = asText(value).trim();
  return text.length > 0 ? text : null;
}

function parsePx(value: any, fallback: number, min: number, max: number) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return Math.round(clamp(value, min, max));
  }
  if (typeof value === "string") {
    const n = parseFloat(value);
    if (Number.isFinite(n)) return Math.round(clamp(n, min, max));
  }
  return fallback;
}

function asPrintFont(value: any, fallback: any) {
  if (!value || typeof value !== "object") return fallback;
  return { ...fallback, ...value };
}

function fontFamilyOf(font: any) {
  const family = asText(font?.fontFamily).trim();
  return family.length > 0 ? family : FONT;
}

function fontWeightOf(font: any, fallback: number) {
  if (typeof font?.fontWeight === "number" && Number.isFinite(font.fontWeight)) {
    return font.fontWeight;
  }
  if (typeof font?.fontWeight === "string") {
    const n = parseFloat(font.fontWeight);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function fontStyleOf(font: any) {
  return font?.fontStyle === "italic" ? "italic" : "normal";
}

function letterSpacingOf(font: any, fallback: string) {
  if (typeof font?.letterSpacing === "number") return `${font.letterSpacing}px`;
  const text = asText(font?.letterSpacing).trim();
  return text.length > 0 ? text : fallback;
}

function lineHeightOf(font: any, size: number, fallbackRatio: number) {
  const raw = font?.lineHeight;
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return raw > 4 ? raw : size * raw;
  }
  if (typeof raw === "string") {
    const n = parseFloat(raw);
    if (!Number.isFinite(n)) return size * fallbackRatio;
    if (raw.includes("%")) return size * (n / 100);
    if (raw.includes("px")) return n;
    if (raw.includes("em")) return size * n;
    return n > 4 ? n : size * n;
  }
  return size * fallbackRatio;
}

function typeGap(fromPx: number, toPx: number, pad: number) {
  return Math.round(clamp(Math.max(pad * 0.28, fromPx * 0.16, toPx * 0.6), 10, 72));
}

function lineAdvance(ctx: CanvasRenderingContext2D, text: string, px: number, lead: number) {
  const m = ctx.measureText(text);
  const ascent = m.actualBoundingBoxAscent;
  const descent = m.actualBoundingBoxDescent;
  const ink = typeof ascent === "number" && Number.isFinite(ascent) && typeof descent === "number" && Number.isFinite(descent) ? ascent + descent : px;
  return Math.round(Math.max(lead, ink + px * 0.08, px));
}

function inkAdvance(ctx: CanvasRenderingContext2D, text: string, px: number) {
  const m = ctx.measureText(text);
  const ascent = m.actualBoundingBoxAscent;
  const descent = m.actualBoundingBoxDescent;
  const ink = typeof ascent === "number" && Number.isFinite(ascent) && typeof descent === "number" && Number.isFinite(descent) ? ascent + descent : px * 0.8;
  return Math.round(clamp(ink, px * 0.7, px));
}

function setPrintFont(ctx: CanvasRenderingContext2D, font: any, px: number, weight = fontWeightOf(font, 400)) {
  ctx.font = `${fontStyleOf(font)} ${weight} ${px}px ${fontFamilyOf(font)}`;
}

function asFoil(value: any) {
  switch (value) {
    case false:
    case "off":
      return "off";
    case "edges":
      return "edges";
    case "marks+edges":
    case "both":
      return "marks+edges";
    case "holo":
    case "marks":
      return "marks";
    case true:
    default:
      return "marks+edges";
  }
}

function foilHasMarks(mode: string) {
  return mode === "marks" || mode === "marks+edges";
}

function foilHasEdges(mode: string) {
  return mode === "edges" || mode === "marks+edges";
}

function drawContained(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, focusY = 0.5) {
  if (img.width < 1 || img.height < 1) return;
  const ir = img.width / img.height;
  const r = w / h;
  let dw = w;
  let dh = h;
  let dx = x;
  let dy = y;
  if (ir > r) {
    dw = h * ir;
    dx = x - (dw - w) / 2;
  } else {
    dh = w / ir;
    dy = y - (dh - h) * focusY;
  }
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.drawImage(img, dx, dy, dw, dh);
  ctx.restore();
}

function makeStudioEnvironment(three: typeof THREE, renderer: THREE.WebGLRenderer) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const sky = ctx.createLinearGradient(0, 0, 0, 256);
  sky.addColorStop(0, "#3a3b40");
  sky.addColorStop(0.42, "#1c1d21");
  sky.addColorStop(0.55, "#101114");
  sky.addColorStop(1, "#050506");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, 512, 256);

  const softbox = (x: number, y: number, w: number, h: number, a: number) => {
    const g = ctx.createRadialGradient(x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, Math.max(w, h) / 2);
    g.addColorStop(0, `rgba(255,252,246,${a})`);
    g.addColorStop(0.6, `rgba(255,252,246,${a * 0.55})`);
    g.addColorStop(1, "rgba(255,252,246,0)");
    ctx.fillStyle = g;
    ctx.fillRect(x, y, w, h);
  };
  softbox(70, 20, 150, 90, 1);
  softbox(210, 40, 120, 70, 0.85);
  softbox(200, 150, 220, 40, 0.3);
  softbox(394, 28, 4, 204, 2.3);

  const equirect = new three.Texture(canvas);
  equirect.mapping = three.EquirectangularReflectionMapping;
  equirect.colorSpace = three.SRGBColorSpace;
  equirect.needsUpdate = true;
  const pmrem = new three.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(equirect).texture;
  equirect.dispose();
  pmrem.dispose();
  return env;
}

function makeFoilMaterial(three: typeof THREE, map: THREE.Texture, alphaMap: THREE.Texture | null) {
  const mat = new three.MeshPhysicalMaterial({
    color: 0x202226,
    map,
    emissive: 0xffffff,
    emissiveMap: map,
    emissiveIntensity: 0.5,
    alphaMap: alphaMap ?? undefined,
    transparent: true,
    opacity: 0.55,
    roughness: 0.2,
    metalness: 0.85,
    depthWrite: false,
    envMapIntensity: 1.6,
  });
  mat.iridescence = 1;
  mat.iridescenceIOR = 1.5;
  mat.iridescenceThicknessRange = [120, 520];
  return mat;
}

function parseColor(color: string): [number, number, number] | null {
  const hex = color.trim();
  if (hex.startsWith("#") && hex.length === 7) {
    return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
  }
  const m = /rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)/.exec(hex);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function isDark(color: string) {
  const rgb = parseColor(color);
  if (!rgb) return true;
  const [r, g, b] = rgb;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 140;
}

function drawCord(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  const dark = isDark(color);
  const hi = dark ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.4)";
  const lo = dark ? "rgba(0,0,0,0.42)" : "rgba(0,0,0,0.18)";
  const strands = 6;
  const pitch = h / 2;
  ctx.lineCap = "butt";
  for (let s = 0; s < strands; s++) {
    const x0 = (s / strands) * w;
    ctx.lineWidth = w / strands;
    ctx.strokeStyle = s % 2 === 0 ? hi : lo;
    for (const off of [-w, 0, w]) {
      ctx.beginPath();
      ctx.moveTo(x0 + off, 0);
      ctx.lineTo(x0 + off + w, pitch);
      ctx.moveTo(x0 + off, pitch);
      ctx.lineTo(x0 + off + w, h);
      ctx.stroke();
    }
  }
}

function drawStrap(canvas: HTMLCanvasElement, ticket: any) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = ticket.strapColor;
  ctx.fillRect(0, 0, w, h);

  if (ticket.strapStyle === "cord") {
    drawCord(ctx, w, h, ticket.strapColor);
    return;
  }

  const dark = isDark(ticket.strapColor);
  const lightHatch = dark ? "rgba(255,255,255,0.09)" : "rgba(255,255,255,0.28)";
  const darkHatch = dark ? "rgba(0,0,0,0.32)" : "rgba(0,0,0,0.12)";
  ctx.lineWidth = 1.2;
  for (let i = -h; i < w + h; i += 5) {
    ctx.strokeStyle = i % 10 === 0 ? lightHatch : darkHatch;
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + h, h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(i + h, 0);
    ctx.lineTo(i, h);
    ctx.stroke();
  }

  const text = ticket.strapText;
  if (!text) return;
  const print = `${text.toUpperCase()}   ·   `;
  ctx.fillStyle = dark ? "rgba(244,243,240,0.9)" : "rgba(10,10,10,0.82)";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.font = `${fontStyleOf(ticket.metaFont)} ${fontWeightOf(ticket.metaFont, 600)} 44px ${fontFamilyOf(ticket.metaFont)}`;
  const runW = Math.max(1, ctx.measureText(print).width);
  const runs = Math.max(1, Math.round(h / runW));
  const stretch = h / (runs * runW);
  const bandU = [0.25, 0.75];
  for (const u of bandU) {
    ctx.save();
    ctx.translate(w * u, 0);
    ctx.rotate(Math.PI / 2);
    ctx.scale(stretch, -1);
    for (let i = 0; i < runs; i++) {
      ctx.fillText(print, i * runW, 0);
    }
    ctx.restore();
  }
}

function edgeTone(three: typeof THREE, paper: string) {
  const color = new three.Color(paper);
  if (isDark(paper)) {
    color.lerp(new three.Color(0xffffff), 0.16);
  } else {
    color.multiplyScalar(0.9);
  }
  return color;
}

function makeNormalTexture(
  three: typeof THREE,
  size: number,
  heightAt: (u: number, v: number) => number,
  scale: number,
  repeatX: number,
  repeatY: number
) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const height = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      height[y * size + x] = heightAt((x / size) * Math.PI * 2, (y / size) * Math.PI * 2);
    }
  }
  const img = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const l = height[y * size + ((x + size - 1) % size)];
      const r = height[y * size + ((x + 1) % size)];
      const t = height[((y + size - 1) % size) * size + x];
      const b = height[((y + 1) % size) * size + x];
      const nx = (l - r) * scale;
      const ny = (t - b) * scale;
      const len = Math.hypot(nx, ny, 1);
      const o = (y * size + x) * 4;
      img.data[o] = Math.round(((nx / len) * 0.5 + 0.5) * 255);
      img.data[o + 1] = Math.round(((ny / len) * 0.5 + 0.5) * 255);
      img.data[o + 2] = Math.round(((1 / len) * 0.5 + 0.5) * 255);
      img.data[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const map = new three.CanvasTexture(canvas);
  map.wrapS = three.RepeatWrapping;
  map.wrapT = three.RepeatWrapping;
  map.repeat.set(repeatX, repeatY);
  map.colorSpace = three.NoColorSpace;
  map.needsUpdate = true;
  return map;
}

function softWobble(u: number, v: number) {
  return Math.sin(u + Math.cos(v * 2) * 1.1) * 0.6 + Math.sin(v * 2 - Math.sin(u) * 0.9) * 0.4;
}

function crispWobble(u: number, v: number) {
  return (
    Math.sin(u * 1.6 + Math.cos(v * 2) * 1.1) * 0.55 +
    Math.sin(v * 2 - Math.sin(u * 1.5) * 0.9) * 0.32 +
    Math.sin((u + v) * 3.2 + Math.cos(u * 2.4) * 0.6) * 0.08
  );
}

function linenWeave(u: number, v: number) {
  const warp = Math.sin(u * 16);
  const weft = Math.sin(v * 16);
  const over = Math.sign(Math.sin(u * 8) * Math.sin(v * 8));
  return warp * warp * 0.42 * (1 + over * 0.22) + weft * weft * 0.42 * (1 - over * 0.22);
}

function makeHoloTexture(three: typeof THREE) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const w = canvas.width;
    const h = canvas.height;
    const g = ctx.createLinearGradient(0, 0, w, h * 0.35);
    g.addColorStop(0, "#ff4fa3");
    g.addColorStop(0.16, "#ffb347");
    g.addColorStop(0.3, "#e9ff5a");
    g.addColorStop(0.46, "#3cf2c8");
    g.addColorStop(0.62, "#3aa0ff");
    g.addColorStop(0.8, "#b06cff");
    g.addColorStop(1, "#ff4fa3");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  const map = new three.CanvasTexture(canvas);
  map.wrapS = three.RepeatWrapping;
  map.wrapT = three.RepeatWrapping;
  map.repeat.set(1.4, 1.9);
  map.anisotropy = 4;
  map.needsUpdate = true;
  return map;
}

function barcodeBars(value: string) {
  const src = value.length > 0 ? value : "PASS";
  const bars = [];
  let hash = 2166136261;
  for (let i = 0; i < src.length; i++) {
    hash ^= src.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
    const bits = Math.abs(hash);
    bars.push({ width: (bits % 3) + 1, ink: true });
    bars.push({ width: ((bits >>> 3) % 2) + 1, ink: false });
    bars.push({ width: ((bits >>> 5) % 3) + 1, ink: true });
    bars.push({ width: 1, ink: false });
  }
  return bars;
}

function inkAlpha(ink: string, alpha: number) {
  const rgb = parseColor(ink);
  if (!rgb) return ink;
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
}

function pathRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function fillRoundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  pathRoundRect(ctx, x, y, w, h, r);
  ctx.fill();
}

function drawFront(canvas: HTMLCanvasElement, mask: HTMLCanvasElement, ticket: any) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  const pad = 56;
  const col = w - pad * 2;

  // Rich, deep dark background
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#0c0d12";
  ctx.fillRect(0, 0, w, h);

  // Outer border
  ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
  ctx.lineWidth = 3;
  pathRoundRect(ctx, 16, 16, w - 32, h - 32, 32);
  ctx.stroke();

  // Top Row: Brand Monogram & Pass Info
  const markSize = 72;
  const markX = pad;
  const markY = pad;

  // "AR" Icon badge
  ctx.fillStyle = "#0ea5e9";
  fillRoundRect(ctx, markX, markY, markSize, markSize, 18);
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  setPrintFont(ctx, ticket.metaFont, 36, 900);
  ctx.fillText("AR", markX + markSize / 2, markY + markSize / 2);

  // Top right pass info
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#38bdf8";
  setPrintFont(ctx, ticket.metaFont, 24, 800);
  ctx.fillText("PORTFOLIO PASS", w - pad, pad + 6);
  ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
  setPrintFont(ctx, ticket.metaFont, 20, 600);
  ctx.fillText("VERIFIED · ALWAR, RJ", w - pad, pad + 38);

  // --- PHOTO CONTAINER (Framed, Crystal Clear, Sharp) ---
  const photoY = markY + markSize + 28;
  const photoH = 680;
  const photoW = col;

  if (ticket.photo) {
    ctx.save();
    pathRoundRect(ctx, markX, photoY, photoW, photoH, 24);
    ctx.clip();
    drawContained(ctx, ticket.photo, markX, photoY, photoW, photoH, 0.22);
    // Subtle gradient only at very bottom of photo for smooth blend into text
    const imgGrad = ctx.createLinearGradient(0, photoY + photoH * 0.75, 0, photoY + photoH);
    imgGrad.addColorStop(0, "rgba(12, 13, 18, 0)");
    imgGrad.addColorStop(1, "rgba(12, 13, 18, 0.9)");
    ctx.fillStyle = imgGrad;
    ctx.fillRect(markX, photoY, photoW, photoH);
    ctx.restore();

    // Sharp border around photo
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
    ctx.lineWidth = 3;
    pathRoundRect(ctx, markX, photoY, photoW, photoH, 24);
    ctx.stroke();
  }

  // --- TEXT SECTION (High Contrast, Bold, Ultra Clear) ---
  let textY = photoY + photoH + 34;

  // Name: AMAN RONEY
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#FFFFFF";
  setPrintFont(ctx, ticket.nameFont, 82, 900);
  ctx.fillText("AMAN RONEY", pad, textY);
  textY += 92;

  // Role: Frontend Web Developer
  ctx.fillStyle = "#38bdf8";
  setPrintFont(ctx, ticket.metaFont, 28, 700);
  ctx.fillText("FRONTEND WEB DEVELOPER", pad, textY);
  textY += 40;

  // Tech Stack / Tags
  ctx.fillStyle = "#94a3b8";
  setPrintFont(ctx, ticket.metaFont, 22, 600);
  ctx.fillText("REACT · JAVASCRIPT · TAILWIND CSS", pad, textY);
  textY += 44;

  // Divider
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad, textY);
  ctx.lineTo(w - pad, textY);
  ctx.stroke();
  textY += 24;

  // Footer: Barcode & Pass ID
  const barH = 50;
  const barW = Math.round(col * 0.52);
  const bars = barcodeBars(ticket.barcodeValue || "AMANRONEYDEV");
  const totalBars = bars.reduce((sum, b) => sum + b.width, 0) || 1;
  let bx = pad;
  for (const bar of bars) {
    const bw = (bar.width / totalBars) * barW;
    if (bar.ink) {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(bx, textY, Math.max(2, bw), barH);
    }
    bx += bw;
  }

  // Pass Number & Status on right
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#FFFFFF";
  setPrintFont(ctx, ticket.numberFont, 36, 800);
  ctx.fillText("DEV-2026", w - pad, textY + 2);
  ctx.fillStyle = "#4ade80"; // Bright active green indicator
  setPrintFont(ctx, ticket.metaFont, 18, 700);
  ctx.fillText("● ACTIVE PASS", w - pad, textY + 42);
}

function drawBack(canvas: HTMLCanvasElement, mask: HTMLCanvasElement, ticket: any) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const w = canvas.width;
  const h = canvas.height;
  const pad = 56;

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#0c0d12";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "rgba(255,255,255,0.16)";
  ctx.lineWidth = 3;
  pathRoundRect(ctx, 16, 16, w - 32, h - 32, 32);
  ctx.stroke();

  ctx.fillStyle = "#38bdf8";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  setPrintFont(ctx, ticket.metaFont, 26, 700);
  ctx.fillText("PORTFOLIO IDENTIFICATION", w / 2, pad + 40);

  // Large Monogram Badge in center
  const mark = 340;
  const markX = Math.round((w - mark) / 2);
  const markY = 380;
  ctx.fillStyle = "#0ea5e9";
  fillRoundRect(ctx, markX, markY, mark, mark, 48);
  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  setPrintFont(ctx, ticket.metaFont, 160, 900);
  ctx.fillText("AR", markX + mark / 2, markY + mark / 2);

  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  setPrintFont(ctx, ticket.numberFont, 56, 800);
  ctx.fillText("AMAN RONEY", w / 2, markY + mark + 60);

  ctx.fillStyle = "#38bdf8";
  setPrintFont(ctx, ticket.metaFont, 26, 700);
  ctx.fillText("FRONTEND WEB DEVELOPER", w / 2, markY + mark + 130);

  ctx.fillStyle = "#94a3b8";
  setPrintFont(ctx, ticket.metaFont, 22, 500);
  ctx.fillText("GITHUB.COM/AMAN1166", w / 2, markY + mark + 175);
}


function particle(x: number, y: number, z: number, pinned = false) {
  return { x, y, z, ox: x, oy: y, oz: z, pinned };
}

function integrateParticle(p: any, dt: number, grav: number, damp: number) {
  if (p.pinned) {
    p.ox = p.x;
    p.oy = p.y;
    p.oz = p.z;
    return;
  }
  const vx = (p.x - p.ox) * damp;
  const vy = (p.y - p.oy) * damp;
  const vz = (p.z - p.oz) * damp;
  p.ox = p.x;
  p.oy = p.y;
  p.oz = p.z;
  p.x += vx;
  p.y += vy + grav * dt * dt;
  p.z += vz;
}

function applyMaxDist(a: any, b: any, maxDist: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dz = b.z - a.z;
  const dist = Math.hypot(dx, dy, dz);
  if (dist <= maxDist || dist < 1e-8) return;
  const frac = (dist - maxDist) / dist;
  const ox = dx * frac;
  const oy = dy * frac;
  const oz = dz * frac;
  if (a.pinned && b.pinned) return;
  if (a.pinned) {
    b.x -= ox;
    b.y -= oy;
    b.z -= oz;
    return;
  }
  if (b.pinned) {
    a.x += ox;
    a.y += oy;
    a.z += oz;
    return;
  }
  a.x += ox * 0.5;
  a.y += oy * 0.5;
  a.z += oz * 0.5;
  b.x -= ox * 0.5;
  b.y -= oy * 0.5;
  b.z -= oz * 0.5;
}

function applyMinDist(a: any, b: any, minDist: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dz = b.z - a.z;
  const dist = Math.hypot(dx, dy, dz);
  if (dist >= minDist || dist < 1e-8) return;
  const frac = (minDist - dist) / dist;
  const ox = dx * frac;
  const oy = dy * frac;
  const oz = dz * frac;
  if (a.pinned && b.pinned) return;
  if (a.pinned) {
    b.x += ox;
    b.y += oy;
    b.z += oz;
    return;
  }
  if (b.pinned) {
    a.x -= ox;
    a.y -= oy;
    a.z -= oz;
    return;
  }
  a.x -= ox * 0.5;
  a.y -= oy * 0.5;
  a.z += oz * 0.5;
  b.x += ox * 0.5;
  b.y += oy * 0.5;
  b.z += oz * 0.5;
}

function makeTubeGeometry(three: typeof THREE, pathSegs: number, radialSegs: number) {
  const geometry = new three.BufferGeometry();
  const rings = pathSegs + 1;
  const cols = radialSegs + 1;
  const positions = new Float32Array(rings * cols * 3);
  const normals = new Float32Array(rings * cols * 3);
  const uvs = new Float32Array(rings * cols * 2);
  const index = [];
  for (let i = 0; i <= pathSegs; i++) {
    for (let j = 0; j <= radialSegs; j++) {
      const u = i * cols + j;
      uvs[u * 2] = j / radialSegs;
      uvs[u * 2 + 1] = i / pathSegs;
    }
  }
  for (let i = 0; i < pathSegs; i++) {
    for (let j = 0; j < radialSegs; j++) {
      const a = i * cols + j;
      const b = (i + 1) * cols + j;
      const c = (i + 1) * cols + j + 1;
      const d = i * cols + j + 1;
      index.push(a, b, d, b, c, d);
    }
  }
  geometry.setAttribute("position", new three.BufferAttribute(positions, 3));
  geometry.setAttribute("normal", new three.BufferAttribute(normals, 3));
  geometry.setAttribute("uv", new three.BufferAttribute(uvs, 2));
  geometry.setIndex(index);
  return { geometry, positions, normals, pathSegs, radialSegs };
}

function updateWebbing(
  three: typeof THREE,
  points: THREE.Vector3[],
  camera: THREE.PerspectiveCamera,
  clipSideWorld: THREE.Vector3,
  halfW: number,
  halfT: number,
  strap: any
) {
  if (points.length < 2) return;
  const curve = new three.CatmullRomCurve3(points, false, "catmullrom", 0.45);
  const cols = strap.radialSegs + 1;
  const tan = new three.Vector3();
  const view = new three.Vector3();
  const sideCam = new three.Vector3();
  const sideClip = new three.Vector3();
  const side = new three.Vector3();
  const bin = new three.Vector3();
  const n = new three.Vector3();

  for (let i = 0; i <= strap.pathSegs; i++) {
    const t = i / strap.pathSegs;
    const p = curve.getPoint(t);
    tan.copy(curve.getTangent(t));
    if (tan.lengthSq() < 1e-8) tan.set(0, -1, 0);
    else tan.normalize();
    view.subVectors(camera.position, p);
    if (view.lengthSq() < 1e-8) view.set(0, 0, 1);
    else view.normalize();
    sideCam.crossVectors(tan, view);
    if (sideCam.lengthSq() < 1e-8) {
      sideCam.set(1, 0, 0);
      sideCam.cross(tan);
    }
    if (sideCam.lengthSq() < 1e-8) sideCam.set(1, 0, 0);
    else sideCam.normalize();
    sideClip.copy(clipSideWorld);
    sideClip.addScaledVector(tan, -sideClip.dot(tan));
    if (sideClip.lengthSq() < 1e-8) sideClip.copy(sideCam);
    else sideClip.normalize();
    if (sideClip.dot(sideCam) < 0) sideClip.negate();
    const twist = t < 0.55 ? 0 : (t - 0.55) / 0.45;
    const k = twist * twist * (3 - 2 * twist);
    side.lerpVectors(sideCam, sideClip, k);
    if (side.lengthSq() < 1e-8) side.copy(sideCam);
    else side.normalize();
    bin.crossVectors(tan, side).normalize();

    for (let j = 0; j <= strap.radialSegs; j++) {
      const v = (j / strap.radialSegs) * Math.PI * 2;
      const cx = Math.cos(v);
      const sy = Math.sin(v);
      n.set(
        (cx / halfW) * side.x + (sy / halfT) * bin.x,
        (cx / halfW) * side.y + (sy / halfT) * bin.y,
        (cx / halfW) * side.z + (sy / halfT) * bin.z
      );
      if (n.lengthSq() < 1e-8) n.copy(side);
      else n.normalize();
      const o = (i * cols + j) * 3;
      strap.positions[o] = p.x + cx * side.x * halfW + sy * bin.x * halfT;
      strap.positions[o + 1] = p.y + cx * side.y * halfW + sy * bin.y * halfT;
      strap.positions[o + 2] = p.z + cx * side.z * halfW + sy * bin.z * halfT;
      strap.normals[o] = n.x;
      strap.normals[o + 1] = n.y;
      strap.normals[o + 2] = n.z;
    }
  }
  const pos = strap.geometry.getAttribute("position");
  const nor = strap.geometry.getAttribute("normal");
  pos.needsUpdate = true;
  nor.needsUpdate = true;
  strap.geometry.computeBoundingSphere();
}

export default function LanyardPass(props: LanyardPassProps) {
  const content = { ...DEFAULT_CONTENT, ...props.content };
  const look = { ...DEFAULT_LOOK, ...props.look };
  const light = { ...DEFAULT_LIGHT, ...props.light };
  const layout = { ...DEFAULT_LAYOUT, ...props.layout };
  const { style, className } = props;

  const attendeeName = visibleText(content.attendeeName) ?? "Aman Roney";
  const ticketType = visibleText(content.ticketType) ?? "Frontend Web Developer";
  const ticketNumber = visibleText(content.ticketNumber) ?? "DEV-2026";
  const eventName = visibleText(content.eventName) ?? "PORTFOLIO PASS";
  const eventDate = visibleText(content.eventDate) ?? "ALWAR, RJ";
  const barcodeValue = visibleText(content.barcodeValue) ?? "AMANRONEYDEV";
  const strapText = visibleText(content.strapText) ?? "AMAN RONEY · FRONTEND DEVELOPER";
  const paper = asText(look.paper) || PAPER;
  const ink = asText(look.ink) || INK;
  const accent = asText(look.accent) || ACCENT;
  const strapColor = asText(look.strapColor) || STRAP;
  const strapStyle = look.strapStyle === "cord" ? "cord" : "flat";
  const finish = look.finish || "gloss";
  const foil = asFoil(look.foil);
  const sleeveOn = Boolean(look.sleeve);
  const lightAngle = clamp(typeof light.angle === "number" ? light.angle : DEFAULT_LIGHT.angle, -180, 180);
  const lightHeight = clamp(typeof light.height === "number" ? light.height : DEFAULT_LIGHT.height, -20, 85);
  const lightIntensity = clamp(typeof light.intensity === "number" ? light.intensity : DEFAULT_LIGHT.intensity, 0, 2);
  const rimOn = light.rim !== false;
  const photoSrc = look.photo || DEMO_PHOTO;
  const size = clampSize(typeof layout.size === "number" ? layout.size : DEFAULT_LAYOUT.size);
  const padding = clampPad(typeof layout.padding === "number" ? layout.padding : DEFAULT_LAYOUT.padding);
  const stackGap = clampStackGap(typeof layout.stackGap === "number" ? layout.stackGap : DEFAULT_LAYOUT.stackGap);
  const nameFont = asPrintFont(look.nameFont, DEFAULT_NAME_FONT);
  const metaFont = asPrintFont(look.metaFont, DEFAULT_META_FONT);
  const numberFont = asPrintFont(look.numberFont, DEFAULT_NUMBER_FONT);

  const thicknessMm = clamp(typeof layout.thickness === "number" ? layout.thickness : DEFAULT_LAYOUT.thickness, THICK_MIN, THICK_MAX);
  const depth = thicknessMm / MM_PER_UNIT;
  const prefersReducedMotion = useReducedMotion();
  const freeze = Boolean(prefersReducedMotion) || props.motion === false;

  const [status, setStatus] = useState("boot");
  const rootRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<any>(null);
  const freezeRef = useRef(freeze);
  freezeRef.current = freeze;

  const ticketRef = useRef({
    attendeeName,
    ticketType,
    ticketNumber,
    eventName,
    eventDate,
    barcodeValue,
    paper,
    ink,
    accent,
    pad: padding,
    stackGap,
    nameFont,
    metaFont,
    numberFont,
    strapColor,
    strapStyle,
    strapText,
    photo: null as HTMLImageElement | null,
  });

  const artRef = useRef({
    photo: null as HTMLImageElement | null,
  });

  const foilRef = useRef(foil);
  foilRef.current = foil;
  const sleeveRef = useRef(sleeveOn);
  sleeveRef.current = sleeveOn;
  const finishRef = useRef(finish);
  finishRef.current = finish;
  const lightRef = useRef({ angle: lightAngle, height: lightHeight, intensity: lightIntensity, rim: rimOn });
  lightRef.current = { angle: lightAngle, height: lightHeight, intensity: lightIntensity, rim: rimOn };
  const depthRef = useRef(depth);
  depthRef.current = depth;

  const stageH = useMemo(() => Math.round(size * 1.72), [size]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stage = rootRef.current;
    if (!stage) return;
    let cancelled = false;
    let dispose: (() => void) | undefined;

    void (async () => {
      try {
        const stageEl = stage;
        const clipY = 2.05;
        const cardHalfH = CARD_H / 2;
        function hangY() {
          return cardHalfH + (sleeveRef.current ? SLEEVE_HEAD : 0);
        }
        function drop() {
          return hangY() - HOLE;
        }

        const clip = particle(0, clipY, 0, true);
        const joints: any[] = [];
        for (let i = 0; i < JOINTS; i++) {
          joints.push(particle(0, clipY - SEG_LEN * (i + 1), 0));
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 80);
        camera.position.set(CAM_X, CAM_Y, CAM_Z);
        camera.up.set(0, 1, 0);
        camera.lookAt(0, CAM_LOOK_Y, 0);
        camera.updateMatrixWorld(true);

        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setClearColor(0, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.shadowMap.enabled = false;
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        renderer.domElement.style.display = "block";
        renderer.domElement.style.touchAction = "none";
        renderer.domElement.style.cursor = "grab";
        stageEl.appendChild(renderer.domElement);

        const envMap = makeStudioEnvironment(THREE, renderer);
        if (envMap) {
          scene.environment = envMap;
          scene.environmentIntensity = 1.05;
        }

        const hemi = new THREE.HemisphereLight(0xdfded2, 0x0b0c0f, 0.22);
        scene.add(hemi);
        const key = new THREE.DirectionalLight(0xf6f8ff, 1.25);
        key.position.set(1.6, 6.4, 3.8);
        scene.add(key);
        const fill = new THREE.DirectionalLight(0x9fb3e6, 0.22);
        fill.position.set(-3.4, 0.6, 3.2);
        scene.add(fill);
        const rim = new THREE.DirectionalLight(0xbce1ff, 1.4);
        rim.position.set(-3.2, 2.2, -2.6);
        scene.add(rim);

        const frontCanvas = document.createElement("canvas");
        frontCanvas.width = TEX_W;
        frontCanvas.height = TEX_H;
        const backCanvas = document.createElement("canvas");
        backCanvas.width = TEX_W;
        backCanvas.height = TEX_H;
        const frontMaskCanvas = document.createElement("canvas");
        frontMaskCanvas.width = TEX_W;
        frontMaskCanvas.height = TEX_H;
        const backMaskCanvas = document.createElement("canvas");
        backMaskCanvas.width = TEX_W;
        backMaskCanvas.height = TEX_H;

        drawFront(frontCanvas, frontMaskCanvas, ticketRef.current);
        drawBack(backCanvas, backMaskCanvas, ticketRef.current);

        const frontMap = new THREE.CanvasTexture(frontCanvas);
        const backMap = new THREE.CanvasTexture(backCanvas);
        const frontMaskMap = new THREE.CanvasTexture(frontMaskCanvas);
        const backMaskMap = new THREE.CanvasTexture(backMaskCanvas);
        frontMap.anisotropy = 16;
        backMap.anisotropy = 16;
        frontMap.generateMipmaps = true;
        backMap.generateMipmaps = true;
        frontMap.minFilter = THREE.LinearMipmapLinearFilter;
        backMap.minFilter = THREE.LinearMipmapLinearFilter;
        frontMap.colorSpace = THREE.SRGBColorSpace;
        backMap.colorSpace = THREE.SRGBColorSpace;
        frontMaskMap.colorSpace = THREE.NoColorSpace;
        backMaskMap.colorSpace = THREE.NoColorSpace;

        const edgeMat = new THREE.MeshStandardMaterial({
          color: edgeTone(THREE, ticketRef.current.paper),
          roughness: 0.34,
          metalness: 0.04,
          envMapIntensity: 0.4,
        });
        const frontMat = new THREE.MeshPhysicalMaterial({
          map: frontMap,
          roughness: 0.35,
          metalness: 0,
          clearcoat: 0.05,
          clearcoatRoughness: 0.1,
          envMapIntensity: 0.15,
        });
        const backMat = new THREE.MeshPhysicalMaterial({
          map: backMap,
          roughness: 0.35,
          metalness: 0,
          clearcoat: 0.05,
          clearcoatRoughness: 0.1,
          envMapIntensity: 0.15,
        });

        let cardGeo = new THREE.BoxGeometry(CARD_W, CARD_H, depthRef.current);
        const cardMesh = new THREE.Mesh(cardGeo, [edgeMat, edgeMat, edgeMat, edgeMat, frontMat, backMat]);
        scene.add(cardMesh);

        const holoMap = makeHoloTexture(THREE);
        const holoFrontMat = makeFoilMaterial(THREE, holoMap, frontMaskMap);
        const holoBackMat = makeFoilMaterial(THREE, holoMap, backMaskMap);
        const holoGeo = new THREE.PlaneGeometry(CARD_W * 0.99, CARD_H * 0.99);
        const holoFront = new THREE.Mesh(holoGeo, holoFrontMat);
        holoFront.position.z = depthRef.current / 2 + 0.003;
        holoFront.renderOrder = 1;
        holoFront.visible = false;
        cardMesh.add(holoFront);
        const holoBack = new THREE.Mesh(holoGeo, holoBackMat);
        holoBack.rotation.y = Math.PI;
        holoBack.position.z = -(depthRef.current / 2 + 0.003);
        holoBack.renderOrder = 1;
        cardMesh.add(holoBack);

        const wobble = makeNormalTexture(THREE, 256, softWobble, 3, 0.7, 1);
        const sleeveMat = new THREE.MeshPhysicalMaterial({
          color: 0x0b0c0f,
          transparent: true,
          opacity: 0,
          roughness: 0.07,
          metalness: 0,
          depthWrite: false,
          clearcoat: 1,
          clearcoatRoughness: 0.05,
          envMapIntensity: 1.8,
          normalMap: wobble ?? undefined,
          normalScale: new THREE.Vector2(0.012, 0.012),
        });
        let sleeveGeo = new THREE.BoxGeometry(CARD_W + SLEEVE_PAD_W, CARD_H + SLEEVE_PAD_H, depthRef.current + SLEEVE_PAD_D);
        const sleeveMesh = new THREE.Mesh(sleeveGeo, sleeveMat);
        sleeveMesh.position.y = SLEEVE_SHIFT;
        sleeveMesh.renderOrder = 2;
        sleeveMesh.visible = false;
        cardMesh.add(sleeveMesh);

        const clipMat = new THREE.MeshStandardMaterial({ color: 0xd6d1ca, metalness: 0.92, roughness: 0.2 });
        const clipShape = new THREE.Shape();
        const cw = 0.26;
        const ch = 0.078;
        const cr = 0.022;
        clipShape.moveTo(-cw / 2 + cr, -ch / 2);
        clipShape.lineTo(cw / 2 - cr, -ch / 2);
        clipShape.quadraticCurveTo(cw / 2, -ch / 2, cw / 2, -ch / 2 + cr);
        clipShape.lineTo(cw / 2, ch / 2 - cr);
        clipShape.quadraticCurveTo(cw / 2, ch / 2, cw / 2 - cr, ch / 2);
        clipShape.lineTo(-cw / 2 + cr, ch / 2);
        clipShape.quadraticCurveTo(-cw / 2, ch / 2, -cw / 2, ch / 2 - cr);
        clipShape.lineTo(-cw / 2, -ch / 2 + cr);
        clipShape.quadraticCurveTo(-cw / 2, -ch / 2, -cw / 2 + cr, -ch / 2);

        const clipGeo = new THREE.ExtrudeGeometry(clipShape, {
          depth: 0.08,
          bevelEnabled: true,
          bevelThickness: 0.008,
          bevelSize: 0.007,
          bevelSegments: 3,
          curveSegments: 6,
        });
        clipGeo.center();
        const badgeClip = new THREE.Mesh(clipGeo, clipMat);
        badgeClip.position.set(0, cardHalfH + 0.016, 0);
        cardMesh.add(badgeClip);

        const clipMesh = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.016, 10, 22), clipMat);
        clipMesh.position.set(0, clipY, 0);
        clipMesh.rotation.x = Math.PI / 2;
        scene.add(clipMesh);

        const strap = makeTubeGeometry(THREE, STRAP_SEGS, STRAP_RADIAL);
        const strapCanvas = document.createElement("canvas");
        strapCanvas.width = STRAP_TEX_W;
        strapCanvas.height = STRAP_TEX_H;
        drawStrap(strapCanvas, ticketRef.current);
        const strapMap = new THREE.CanvasTexture(strapCanvas);
        strapMap.colorSpace = THREE.SRGBColorSpace;
        strapMap.wrapS = THREE.RepeatWrapping;
        strapMap.wrapT = THREE.RepeatWrapping;
        strapMap.repeat.set(1, STRAP_REPEAT);
        strapMap.anisotropy = 8;
        const strapMat = new THREE.MeshStandardMaterial({ map: strapMap, roughness: 0.82, metalness: 0 });
        const strapMesh = new THREE.Mesh(strap.geometry, strapMat);
        scene.add(strapMesh);

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        const dragPlane = new THREE.Plane();
        const planeHit = new THREE.Vector3();
        const camDir = new THREE.Vector3();
        const holeWorld = new THREE.Vector3();
        const clipAxis = new THREE.Vector3();
        const jointPts = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
        const grabOff = { x: 0, y: 0, z: 0 };
        const grabState = { down: false, pointerId: -1, lastT: 0, lastNdcX: 0, vx: 0, vy: 0, vz: 0 };

        let acc = 0;
        let spinY = 0.16;
        let spinVel = 0;
        let simT = 0;

        function paintTicket() {
          ticketRef.current.photo = artRef.current.photo;
          drawFront(frontCanvas, frontMaskCanvas, ticketRef.current);
          drawBack(backCanvas, backMaskCanvas, ticketRef.current);
          drawStrap(strapCanvas, ticketRef.current);
          frontMap.needsUpdate = true;
          backMap.needsUpdate = true;
          frontMaskMap.needsUpdate = true;
          backMaskMap.needsUpdate = true;
          strapMap.needsUpdate = true;
          edgeMat.color.copy(edgeTone(THREE, ticketRef.current.paper));
        }

        function poseHang(angle: number) {
          for (let i = 0; i < JOINTS; i++) {
            const dist = SEG_LEN * (i + 1);
            const j = joints[i];
            j.x = Math.sin(angle) * dist;
            j.y = clipY - Math.cos(angle) * dist;
            j.z = 0;
            j.ox = j.x;
            j.oy = j.y;
            j.oz = j.z;
            j.pinned = false;
          }
        }

        function solveRope() {
          const min = SEG_LEN * 0.34;
          const chain = [clip, ...joints];
          for (let n = 0; n < ROPE_ITERS; n++) {
            for (let i = 0; i < chain.length - 1; i++) {
              applyMaxDist(chain[i], chain[i + 1], SEG_LEN);
              applyMinDist(chain[i], chain[i + 1], min);
            }
          }
          const floor = clipY - SEG_LEN * JOINTS * 1.45;
          for (const joint of joints) {
            if (joint.y > clipY - 0.03) joint.y = clipY - 0.03;
            if (joint.y < floor) joint.y = floor;
            joint.z *= 0.92;
          }
        }

        function simulate() {
          const hole = joints[JOINTS - 1];
          hole.pinned = grabState.down;
          for (const joint of joints) {
            integrateParticle(joint, DT, GRAVITY, AIR);
          }
          solveRope();
          simT += DT;
          if (!grabState.down) {
            const turn = Math.PI * 2;
            const home = Math.round(spinY / turn) * turn;
            const sway = Math.sin(simT * 0.55) * 0.07;
            const target = home + sway;
            const fast = Math.abs(spinVel) > 1.6;
            if (fast) {
              spinVel *= 0.985;
            } else {
              spinVel += (target - spinY) * IDLE_SPRING * DT;
              spinVel *= Math.pow(IDLE_DAMP, DT * 60);
            }
            spinY += spinVel * DT;
            hole.x += Math.sin(simT * 0.7) * 45e-5;
          }
        }

        function cardCenter() {
          const hole = joints[JOINTS - 1];
          return { x: hole.x, y: hole.y - drop(), z: hole.z };
        }

        function syncVisuals() {
          const hole = joints[JOINTS - 1];
          const reach = SEG_LEN * JOINTS || 1;
          const swing = clamp(hole.x / reach, -1, 1);
          const lift = clamp((clipY - SEG_LEN * JOINTS - hole.y) / reach, -1, 1);
          cardMesh.position.set(hole.x, hole.y - drop(), hole.z);
          cardMesh.rotation.set(-0.18 + lift * 0.22, spinY, swing * 0.12);
          cardMesh.updateMatrixWorld(true);

          jointPts[0].set(clip.x, clip.y, clip.z);
          jointPts[1].set(joints[0].x, joints[0].y, joints[0].z);
          jointPts[2].set(joints[1].x, joints[1].y, joints[1].z);
          holeWorld.set(0, hangY() + 0.02, 0);
          holeWorld.applyMatrix4(cardMesh.matrixWorld);
          jointPts[3].copy(holeWorld);
          clipAxis.set(1, 0, 0);
          clipAxis.transformDirection(cardMesh.matrixWorld);

          const cord = ticketRef.current.strapStyle === "cord";
          updateWebbing(THREE, jointPts, camera, clipAxis, cord ? CORD_R : STRAP_HALF_W, cord ? CORD_R : STRAP_HALF_T, strap);
        }

        function frameCamera() {
          const w = Math.max(1, stageEl.clientWidth);
          const h = Math.max(1, stageEl.clientHeight);
          renderer.setSize(w, h, false);
          camera.aspect = w / h;
          camera.position.set(CAM_X, CAM_Y, CAM_Z);
          camera.lookAt(0, CAM_LOOK_Y, 0);
          camera.updateProjectionMatrix();
          camera.updateMatrixWorld(true);
        }

        function pointerNdc(event: PointerEvent) {
          const rect = renderer.domElement.getBoundingClientRect();
          const w = rect.width || 1;
          const h = rect.height || 1;
          pointer.x = ((event.clientX - rect.left) / w) * 2 - 1;
          pointer.y = -((event.clientY - rect.top) / h) * 2 + 1;
        }

        function onDown(event: PointerEvent) {
          if (freezeRef.current) return;
          pointerNdc(event);
          raycaster.setFromCamera(pointer, camera);
          const hits = raycaster.intersectObject(cardMesh, true);
          if (hits.length === 0) return;
          event.preventDefault();
          renderer.domElement.setPointerCapture(event.pointerId);
          renderer.domElement.style.cursor = "grabbing";
          grabState.down = true;
          grabState.pointerId = event.pointerId;
          grabState.lastT = performance.now();
          grabState.vx = 0;
          grabState.vy = 0;
          grabState.vz = 0;
          grabState.lastNdcX = pointer.x;
          const center = cardCenter();
          const hit = hits[0].point;
          grabOff.x = center.x - hit.x;
          grabOff.y = center.y - hit.y;
          grabOff.z = center.z - hit.z;
          camera.getWorldDirection(camDir);
          dragPlane.setFromNormalAndCoplanarPoint(camDir, hit);
        }

        function onMove(event: PointerEvent) {
          if (!grabState.down || event.pointerId !== grabState.pointerId) return;
          pointerNdc(event);
          raycaster.setFromCamera(pointer, camera);
          const hit = raycaster.ray.intersectPlane(dragPlane, planeHit);
          if (!hit) return;
          const travel = stageEl.clientWidth < NARROW_AT ? 0.52 : 1;
          const give = 1 + 0.28 * SWING_STRENGTH;
          const maxR = SEG_LEN * JOINTS * 0.85 * travel * give;
          const tx = hit.x + grabOff.x;
          const ty = hit.y + grabOff.y;
          const tz = clamp(hit.z + grabOff.z, -0.4, 0.4);
          const restY = clipY - SEG_LEN * JOINTS - drop();
          const dx = tx;
          const dy = ty - restY;
          const reach = Math.hypot(dx, dy);
          let gx = tx;
          let gy = ty;
          if (reach > maxR) {
            gx = (dx / reach) * maxR;
            gy = restY + (dy / reach) * maxR;
          }
          const now = performance.now();
          const stepDt = Math.max(DT, (now - grabState.lastT) / 1000);
          const hole = joints[JOINTS - 1];
          const nx = gx;
          const ny = gy + drop();
          const nz = tz;
          grabState.vx = (nx - hole.x) / stepDt;
          grabState.vy = (ny - hole.y) / stepDt;
          grabState.vz = (nz - hole.z) / stepDt;
          const dYaw = (pointer.x - grabState.lastNdcX) * 3.4;
          spinY += dYaw;
          spinVel = dYaw / stepDt;
          grabState.lastNdcX = pointer.x;
          grabState.lastT = now;
          hole.x = nx;
          hole.y = ny;
          hole.z = nz;
          hole.ox = nx;
          hole.oy = ny;
          hole.oz = nz;
        }

        function onUp(event: PointerEvent) {
          if (!grabState.down || event.pointerId !== grabState.pointerId) return;
          grabState.down = false;
          renderer.domElement.style.cursor = "grab";
          try {
            renderer.domElement.releasePointerCapture(event.pointerId);
          } catch {
            /* ignore */
          }
          const travel = stageEl.clientWidth < NARROW_AT ? 0.55 : 1;
          const scale = 0.55 * SWING_STRENGTH * travel;
          const hole = joints[JOINTS - 1];
          hole.pinned = false;
          const vx = clamp(grabState.vx * scale, -10, 10);
          const vy = clamp(grabState.vy * scale, -12, 12);
          const vz = clamp(grabState.vz * scale, -4, 4);
          hole.ox = hole.x - vx * DT;
          hole.oy = hole.y - vy * DT;
          hole.oz = hole.z - vz * DT;
          spinVel += clamp(-vx * 0.28, -8, 8);
        }

        paintTicket();
        poseHang(0);
        for (let i = 0; i < 48; i++) simulate();
        spinY = 0.16;
        spinVel = 0;
        frameCamera();
        syncVisuals();
        renderer.render(scene, camera);

        let raf = 0;
        let last = performance.now();
        const running = { on: false };

        function loop(now: number) {
          raf = requestAnimationFrame(loop);
          const dt = Math.min(0.05, (now - last) / 1000);
          last = now;
          if (!freezeRef.current) {
            acc += dt;
            let steps = 0;
            while (acc >= DT && steps < 2) {
              simulate();
              acc -= DT;
              steps += 1;
            }
            if (acc >= DT) acc = 0;
          } else {
            acc = 0;
            poseHang(0);
          }
          syncVisuals();
          renderer.render(scene, camera);
        }

        function startLoop() {
          if (running.on) return;
          running.on = true;
          last = performance.now();
          acc = 0;
          raf = requestAnimationFrame(loop);
        }

        function stopLoop() {
          running.on = false;
          if (raf) cancelAnimationFrame(raf);
          raf = 0;
        }

        startLoop();

        const ro = new ResizeObserver(() => {
          frameCamera();
        });
        ro.observe(stageEl);

        const canvas = renderer.domElement;
        canvas.addEventListener("pointerdown", onDown);
        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);
        window.addEventListener("pointercancel", onUp);

        engineRef.current = { paint: paintTicket };
        if (!cancelled) startTransition(() => setStatus("ready"));

        dispose = () => {
          engineRef.current = null;
          stopLoop();
          ro.disconnect();
          canvas.removeEventListener("pointerdown", onDown);
          window.removeEventListener("pointermove", onMove);
          window.removeEventListener("pointerup", onUp);
          window.removeEventListener("pointercancel", onUp);
          cardGeo.dispose();
          strap.geometry.dispose();
          badgeClip.geometry.dispose();
          sleeveGeo.dispose();
          holoGeo.dispose();
          holoMap.dispose();
          holoFrontMat.dispose();
          holoBackMat.dispose();
          frontMaskMap.dispose();
          backMaskMap.dispose();
          frontMap.dispose();
          backMap.dispose();
          edgeMat.dispose();
          frontMat.dispose();
          backMat.dispose();
          clipMat.dispose();
          strapMap.dispose();
          strapMat.dispose();
          sleeveMat.dispose();
          clipMesh.geometry.dispose();
          renderer.dispose();
          if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
        };
      } catch (err) {
        console.error(err);
        if (!cancelled) startTransition(() => setStatus("fail"));
      }
    })();

    return () => {
      cancelled = true;
      dispose?.();
    };
  }, []);

  // Load photo
  useEffect(() => {
    if (typeof window === "undefined") return;
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      artRef.current.photo = img;
      engineRef.current?.paint();
    };
    img.src = photoSrc;
    return () => {
      cancelled = true;
    };
  }, [photoSrc]);

  return (
    <div
      ref={rootRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: stageH,
        overflow: "visible",
        background: "transparent",
        touchAction: "none",
        userSelect: "none",
        ...style,
      }}
    >
      <div
        role="status"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
          opacity: status === "ready" ? 0 : 1,
          color: ink,
          fontFamily: fontFamilyOf(metaFont),
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {status === "fail" ? "" : status === "boot" ? "Loading badge..." : ""}
      </div>
    </div>
  );
}
