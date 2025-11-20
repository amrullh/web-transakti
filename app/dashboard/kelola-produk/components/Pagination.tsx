"use client";

export default function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void; }) {
  if (total <= 1) return null;
  const pages: (number | "...")[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("...");
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (current < total - 2) pages.push("...");
    pages.push(total);
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1}>Sebelumnya</button>
      {pages.map((p, i) => p === "..." ? <span key={i}>...</span> : <button key={p} onClick={() => onChange(p as number)} style={{ background: p === current ? "#2f6a90" : "transparent", color: p === current ? "white" : "inherit", padding: "6px 10px", borderRadius: 6 }}>{p}</button>)}
      <button onClick={() => onChange(Math.min(total, current + 1))} disabled={current === total}>Setelahnya</button>
    </div>
  );
}