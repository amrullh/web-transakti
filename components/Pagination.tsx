"use client";

interface Props {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

export default function Pagination({ current, total, onChange }: Props) {
  const minimalPages = total < 1 ? 1 : total;

  const pages: (number | "...")[] = [];
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("...");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
      pages.push(i);
    }
    if (current < total - 2) pages.push("...");
    pages.push(total);
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
      >
        Sebelumnya
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={i}>…</span>
        ) : (
          <button
            key={i}
            onClick={() => onChange(p as number)}
            style={{
              background: p === current ? "#2f6a90" : "transparent",
              color: p === current ? "white" : "#374151",
              border: "1px solid #d1d5db",
              padding: "6px 10px",
              borderRadius: 6,
            }}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
      >
        Setelahnya
      </button>
    </div>
  );
}