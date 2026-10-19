import { useEffect, useRef } from "react";
import styled from "styled-components";

// Red "plexus" animada de la landing B2B (portada de plexus.js, de la carpeta de recursos): una banda de nodos que flota
// sobre la foto del banner y un globo de nodos que gira (Próximos workshops / Adaptación). Es un <canvas> decorativo:
// aria-hidden, se detiene fuera de pantalla y, con movimiento reducido, se dibuja un solo cuadro estático.

type Pt = [number, number];
interface Renderer {
  resize: () => void;
  frame: (dt: number) => void;
}

export interface BandOptions {
  seed?: number;
  count?: number;
  /** Rango horizontal (0–1 del ancho) donde nacen los nodos. */
  u0?: number;
  u1?: number;
  /** Desde qué fracción del ancho empieza a aparecer la red. */
  fade0?: number;
  y?: number;
  amp?: number;
  thick?: number;
  dist?: number;
}

export interface GlobeOptions {
  seed?: number;
  count?: number;
  link?: number;
  speed?: number;
}

const lcg = (seed: number) => () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const TAU = Math.PI * 2;

const fit = (c: HTMLCanvasElement) => {
  const r = c.getBoundingClientRect();
  const d = Math.min(window.devicePixelRatio || 1, 2);
  c.width = Math.max(1, Math.round(r.width * d));
  c.height = Math.max(1, Math.round(r.height * d));
  return { W: r.width, H: r.height, d };
};

interface BandNode {
  u: number;
  off: number;
  ph: number;
  sp: number;
  z: number;
}

const createBand = (c: HTMLCanvasElement, ctx: CanvasRenderingContext2D, o: BandOptions): Renderer => {
  let S = { W: 1, H: 1, d: 1 };
  let nodes: BandNode[] = [];
  let t = 0;
  const u0 = o.u0 ?? 0.4;
  const u1 = o.u1 ?? 1.06;
  const fade0 = o.fade0 ?? 0.45;

  const resize = () => {
    S = fit(c);
    const R = lcg(o.seed || 7);
    const g = () => (R() + R() + R() - 1.5) / 1.5;
    const n = Math.round((o.count || 120) * Math.min(1.2, S.W / 1300 + 0.3));
    nodes = Array.from({ length: n }, () => ({ u: u0 + R() * (u1 - u0), off: g(), ph: R() * 6.28, sp: 0.15 + R() * 0.3, z: R() }));
  };

  const fade = (x: number) => Math.max(0, Math.min(1, (x - S.W * fade0) / (S.W * 0.2)));

  const frame = (dt: number) => {
    t += dt;
    const { W, H, d } = S;
    ctx.setTransform(d, 0, 0, d, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const P: Pt[] = nodes.map((n) => [
      n.u * W + Math.cos(t * n.sp + n.ph) * 10,
      H * (o.y ?? 0.5) + Math.sin(n.u * 5 + t * 0.18) * H * (o.amp ?? 0.14) + n.off * H * (o.thick ?? 0.15) + Math.sin(t * n.sp + n.ph) * 8,
    ]);
    const D = Math.min(W, H) * (o.dist ?? 0.11);
    const D2 = D * D;
    const adj: number[][] = P.map(() => []);
    for (let i = 0; i < P.length; i++) {
      for (let j = i + 1; j < P.length; j++) {
        const dx = P[i][0] - P[j][0];
        const dy = P[i][1] - P[j][1];
        if (dx * dx + dy * dy < D2) {
          adj[i].push(j);
          adj[j].push(i);
        }
      }
    }
    // Triángulos translúcidos.
    ctx.fillStyle = "rgba(127,224,204,.035)";
    for (let i = 0; i < P.length; i += 3) {
      for (const j of adj[i]) {
        if (j <= i) continue;
        for (const k of adj[j]) {
          if (k > j && adj[i].length <= 6 && adj[i].includes(k)) {
            ctx.globalAlpha = fade((P[i][0] + P[j][0] + P[k][0]) / 3);
            ctx.beginPath();
            ctx.moveTo(P[i][0], P[i][1]);
            ctx.lineTo(P[j][0], P[j][1]);
            ctx.lineTo(P[k][0], P[k][1]);
            ctx.fill();
          }
        }
      }
    }
    // Aristas.
    ctx.globalAlpha = 1;
    ctx.lineWidth = 0.7;
    for (let i = 0; i < P.length; i++) {
      for (const j of adj[i]) {
        if (j <= i) continue;
        const dx = P[i][0] - P[j][0];
        const dy = P[i][1] - P[j][1];
        const a = (1 - Math.sqrt(dx * dx + dy * dy) / D) * 0.4 * fade((P[i][0] + P[j][0]) / 2);
        if (a < 0.01) continue;
        ctx.strokeStyle = (i + j) % 4 === 0 ? `rgba(196,181,245,${a})` : `rgba(127,224,204,${a})`;
        ctx.beginPath();
        ctx.moveTo(P[i][0], P[i][1]);
        ctx.lineTo(P[j][0], P[j][1]);
        ctx.stroke();
      }
    }
    // Nodos (los más cercanos al espectador brillan).
    P.forEach(([x, y], i) => {
      const n = nodes[i];
      const f = fade(x);
      if (f <= 0) return;
      const tw = 0.55 + 0.45 * Math.sin(t * (0.6 + n.sp) + n.ph * 3);
      const r = 0.9 + n.z * 1.6;
      if (n.z > 0.8) {
        const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 6);
        glow.addColorStop(0, `rgba(168,240,224,${0.3 * f * tw})`);
        glow.addColorStop(1, "rgba(127,224,204,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, r * 6, 0, TAU);
        ctx.fill();
      }
      ctx.fillStyle = `rgba(168,240,224,${(0.4 + 0.5 * tw) * f})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
    });
  };

  return { resize, frame };
};

const createGlobe = (c: HTMLCanvasElement, ctx: CanvasRenderingContext2D, o: GlobeOptions): Renderer => {
  let S = { W: 1, H: 1, d: 1 };
  let t = 0;
  const N = o.count || 220;
  // Puntos repartidos en una esfera (espiral de Fibonacci) y aristas entre vecinos cercanos: se calculan una sola vez.
  const pts: [number, number, number][] = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = i * 2.39996;
    pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
  }
  const R = lcg(o.seed || 3);
  const z = pts.map(() => R());
  const edges: [number, number][] = [];
  const link = o.link || 0.075;
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) {
      const dx = pts[i][0] - pts[j][0];
      const dy = pts[i][1] - pts[j][1];
      const dz = pts[i][2] - pts[j][2];
      if (dx * dx + dy * dy + dz * dz < link) edges.push([i, j]);
    }
  }

  const resize = () => {
    S = fit(c);
  };

  const frame = (dt: number) => {
    t += dt;
    const { W, H, d } = S;
    ctx.setTransform(d, 0, 0, d, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const cx = W / 2;
    const cy = H / 2;
    const rad = Math.min(W, H) * 0.42;
    const a = t * (o.speed || 0.12);
    const tilt = 0.35;
    const g0 = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad * 1.25);
    g0.addColorStop(0, "rgba(110,60,200,.45)");
    g0.addColorStop(0.6, "rgba(91,143,224,.12)");
    g0.addColorStop(1, "rgba(110,60,200,0)");
    ctx.fillStyle = g0;
    ctx.fillRect(0, 0, W, H);
    const P = pts.map(([x, y, zz]) => {
      const x1 = x * Math.cos(a) + zz * Math.sin(a);
      const z1 = -x * Math.sin(a) + zz * Math.cos(a);
      const y2 = y * Math.cos(tilt) - z1 * Math.sin(tilt);
      const z2 = y * Math.sin(tilt) + z1 * Math.cos(tilt);
      return [cx + x1 * rad, cy + y2 * rad, z2] as [number, number, number];
    });
    ctx.lineWidth = 0.8;
    for (const [i, j] of edges) {
      const dz = (P[i][2] + P[j][2]) / 2;
      const al = 0.08 + (0.42 * (dz + 1)) / 2;
      ctx.strokeStyle = (i + j) % 4 === 0 ? `rgba(196,181,245,${al})` : `rgba(127,224,204,${al})`;
      ctx.beginPath();
      ctx.moveTo(P[i][0], P[i][1]);
      ctx.lineTo(P[j][0], P[j][1]);
      ctx.stroke();
    }
    P.forEach(([x, y, zz], i) => {
      const f = 0.2 + (0.8 * (zz + 1)) / 2;
      const r = (0.8 + z[i] * 1.6) * (0.7 + 0.5 * f);
      if (z[i] > 0.85 && zz > 0) {
        const glow = ctx.createRadialGradient(x, y, 0, x, y, r * 7);
        glow.addColorStop(0, `rgba(168,240,224,${0.45 * f})`);
        glow.addColorStop(1, "rgba(127,224,204,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, r * 7, 0, TAU);
        ctx.fill();
      }
      ctx.fillStyle = `rgba(168,240,224,${f})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, TAU);
      ctx.fill();
    });
  };

  return { resize, frame };
};

const Canvas = styled.canvas`
  display: block;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

type PlexusProps = ({ kind: "band"; options?: BandOptions } | { kind: "globe"; options?: GlobeOptions }) & { className?: string };

export const Plexus = (props: PlexusProps) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { kind, className } = props;
  const options = props.options;

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const renderer = kind === "band" ? createBand(canvas, ctx, (options ?? {}) as BandOptions) : createGlobe(canvas, ctx, (options ?? {}) as GlobeOptions);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let visible = true;
    let raf = 0;
    let last = performance.now();

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (visible) renderer.frame(dt);
    };

    const ro = new ResizeObserver(() => {
      renderer.resize();
      if (still) renderer.frame(0);
    });
    ro.observe(canvas);
    renderer.resize();
    renderer.frame(0);

    let io: IntersectionObserver | undefined;
    if (!still) {
      if (typeof IntersectionObserver !== "undefined") {
        io = new IntersectionObserver((entries) => {
          visible = entries.some((e) => e.isIntersecting);
          last = performance.now();
        });
        io.observe(canvas);
      }
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io?.disconnect();
    };
  }, [kind, options]);

  return <Canvas ref={ref} className={className} aria-hidden="true" />;
};
