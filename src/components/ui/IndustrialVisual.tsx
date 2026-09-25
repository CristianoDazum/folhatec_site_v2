import type { ReactNode } from "react";
import type { VisualKey } from "@/types/content";
import { cn } from "@/lib/cn";

/**
 * Composição visual neutra (SVG decorativo) usada enquanto não existem
 * fotografias reais. Não contém texto e é ignorada por leitores de tela.
 * Todos os elementos ficam dentro do próprio SVG — sem posicionamento
 * absoluto vazando para fora do container.
 */

const INK = "var(--ink)";
const ACCENT = "var(--accent)";
const LINE = "var(--line-strong)";
const SURFACE = "var(--surface)";

function Barcode({ x, y, height = 34 }: { x: number; y: number; height?: number }) {
  const bars = [3, 1, 2, 1, 3, 2, 1, 1, 3, 1, 2, 3, 1, 2, 1, 3, 1, 2];
  let offset = x;
  return (
    <g fill={INK}>
      {bars.map((width, index) => {
        const bar = index % 2 === 0 ? <rect key={index} x={offset} y={y} width={width} height={height} /> : null;
        offset += width + 2;
        return bar;
      })}
    </g>
  );
}

function LabelCard({ x, y, w = 150, h = 96 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={SURFACE} stroke={LINE} />
      <rect x={x + 14} y={y + 14} width={46} height={6} rx={3} fill={ACCENT} />
      <rect x={x + 14} y={y + 26} width={w - 60} height={5} rx={2.5} fill={LINE} />
      <rect x={x + 14} y={y + 36} width={w - 84} height={5} rx={2.5} fill={LINE} />
      <Barcode x={x + 14} y={y + h - 44} height={30} />
    </g>
  );
}

function Roll({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={SURFACE} stroke={LINE} strokeWidth={1.5} />
      <circle cx={cx} cy={cy} r={r * 0.78} fill="none" stroke={LINE} />
      <circle cx={cx} cy={cy} r={r * 0.58} fill="none" stroke={LINE} />
      <circle cx={cx} cy={cy} r={r * 0.36} fill={INK} />
      <circle cx={cx} cy={cy} r={r * 0.2} fill={SURFACE} />
    </g>
  );
}

const foregrounds: Record<VisualKey, ReactNode> = {
  labels: (
    <g>
      <Roll cx={170} cy={180} r={96} />
      <path d="M170 276 H330 V246 H266" fill="none" stroke={LINE} strokeWidth={1.5} />
      <g transform="rotate(-6 330 190)">
        <LabelCard x={262} y={138} w={170} h={108} />
      </g>
    </g>
  ),
  ribbons: (
    <g>
      <path d="M150 90 L340 120 L340 216 L150 240 Z" fill={INK} opacity={0.9} />
      <path d="M150 165 L340 168" stroke={ACCENT} strokeWidth={2} strokeDasharray="6 8" />
      <Roll cx={150} cy={165} r={75} />
      <Roll cx={340} cy={168} r={48} />
      <LabelCard x={250} y={236} w={150} h={84} />
    </g>
  ),
  equipment: (
    <g>
      <rect x={120} y={110} width={240} height={140} rx={18} fill={INK} />
      <rect x={140} y={130} width={82} height={40} rx={6} fill={SURFACE} opacity={0.12} />
      <circle cx={330} cy={150} r={9} fill={ACCENT} />
      <rect x={150} y={232} width={180} height={10} rx={5} fill={SURFACE} opacity={0.2} />
      <LabelCard x={170} y={238} w={140} h={84} />
    </g>
  ),
  special: (
    <g>
      <g transform="rotate(-10 240 180)">
        <rect x={150} y={100} width={180} height={120} rx={12} fill={SURFACE} stroke={LINE} />
      </g>
      <g transform="rotate(-3 240 180)">
        <rect x={160} y={118} width={180} height={120} rx={12} fill={SURFACE} stroke={LINE} />
      </g>
      <LabelCard x={170} y={136} w={180} h={120} />
      <circle cx={352} cy={130} r={22} fill={ACCENT} />
      <path d="M343 130 l6 6 12-12" fill="none" stroke={SURFACE} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  food: (
    <g>
      <rect x={120} y={120} width={240} height={150} rx={16} fill={SURFACE} stroke={LINE} />
      <path d="M120 170 H360" stroke={LINE} />
      <LabelCard x={150} y={186} w={130} h={70} />
      <g stroke={ACCENT} strokeWidth={3} strokeLinecap="round">
        <path d="M320 196 v48 M300 208 l40 24 M340 208 l-40 24" />
      </g>
    </g>
  ),
  logistics: (
    <g>
      <rect x={100} y={150} width={130} height={110} rx={8} fill={SURFACE} stroke={LINE} />
      <rect x={240} y={110} width={150} height={150} rx={8} fill={SURFACE} stroke={LINE} />
      <path d="M100 196 H230 M240 164 H390" stroke={LINE} />
      <LabelCard x={262} y={178} w={108} h={66} />
      <rect x={90} y={262} width={310} height={12} rx={6} fill={INK} />
    </g>
  ),
  chemical: (
    <g>
      <path d="M200 100 h80 M214 100 v58 l-54 96 a14 14 0 0 0 12 20 h136 a14 14 0 0 0 12 -20 l-54 -96 v-58" fill={SURFACE} stroke={INK} strokeWidth={2} />
      <path d="M176 232 h128 l16 30 H160 Z" fill={ACCENT} opacity={0.85} />
      <LabelCard x={292} y={120} w={120} h={76} />
    </g>
  ),
  industry: (
    <g>
      <path d="M100 270 V170 l60 34 v-34 l60 34 v-34 l60 34 V120 h60 v150 Z" fill={SURFACE} stroke={INK} strokeWidth={2} />
      <rect x={290} y={96} width={40} height={24} fill={INK} />
      <rect x={128} y={226} width={30} height={44} fill={ACCENT} />
      <LabelCard x={300} y={188} w={110} h={72} />
    </g>
  ),
};

export function IndustrialVisual({
  visual,
  className,
  tone = "light",
}: {
  visual: VisualKey;
  className?: string;
  tone?: "light" | "muted";
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative isolate overflow-clip",
        tone === "light" ? "bg-surface-muted" : "bg-background",
        className,
      )}
    >
      <div className="bg-grid absolute inset-0" />
      <svg
        viewBox="0 0 480 360"
        preserveAspectRatio="xMidYMid meet"
        className="relative h-full w-full"
        focusable="false"
      >
        <circle cx={420} cy={40} r={90} fill={ACCENT} opacity={0.06} />
        <circle cx={40} cy={340} r={110} fill={INK} opacity={0.04} />
        {foregrounds[visual]}
        <g>
          <rect x={32} y={318} width={64} height={6} rx={3} fill={ACCENT} opacity={0.8} />
          <rect x={102} y={318} width={28} height={6} rx={3} fill={INK} opacity={0.18} />
          <rect x={136} y={318} width={40} height={6} rx={3} fill={INK} opacity={0.1} />
        </g>
      </svg>
    </div>
  );
}
