"use client";

import { useState } from "react";

interface Props {
  kategoriFilter: string;
  setKategoriFilter: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
}

export default function FilterDropdown({
  kategoriFilter,
  setKategoriFilter,
  statusFilter,
  setStatusFilter
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          padding: "8px 12px",
          borderRadius: "8px",
          background: "#2f6a90",
          color: "white",
          border: "none",
          cursor: "pointer"
        }}
      >
        Filter
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: 40,
            right: 0,
            width: 220,
            background: "#fff",
            border: "1px solid #e4e4e4",
            borderRadius: 8,
            padding: 12,
            zIndex: 99
          }}
        >
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, marginBottom: 4 }}>Kategori</div>
            <select
              value={kategoriFilter}
              onChange={(e) => setKategoriFilter(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #d7d7d7"
              }}
            >
              <option value="">Semua</option>
              <option value="Makanan">Makanan</option>
              <option value="Minuman">Minuman</option>
            </select>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, marginBottom: 4 }}>Status</div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                width: "100%",
                padding: 8,
                borderRadius: 6,
                border: "1px solid #d7d7d7"
              }}
            >
              <option value="">Semua</option>
              <option value="Aktif">Aktif</option>
              <option value="Tidak Aktif">Tidak Aktif</option>
            </select>
          </div>

          <button
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              border: "none",
              background: "#e2e8f0",
              cursor: "pointer"
            }}
            onClick={() => {
              setKategoriFilter("");
              setStatusFilter("");
            }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}