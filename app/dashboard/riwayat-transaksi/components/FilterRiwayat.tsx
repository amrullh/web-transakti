"use client";

interface Props {
  metode: string;
  setMetode: (v: string) => void;
  dari: string;
  setDari: (v: string) => void;
  sampai: string;
  setSampai: (v: string) => void;
}

export default function FilterRiwayat({
  metode,
  setMetode,
  dari,
  setDari,
  sampai,
  setSampai
}: Props) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <div>
        <label style={{ display: "block", fontSize: 12 }}>Filter:</label>
        <select
          value={metode}
          onChange={(e) => setMetode(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #d7d7d7",
            width: 120
          }}
        >
          <option value="">Semua</option>
          <option value="Cash">Cash</option>
          <option value="QRIS">QRIS</option>
          <option value="Transfer">Transfer</option>
        </select>
      </div>

      <div>
        <label style={{ display: "block", fontSize: 12 }}>Dari:</label>
        <input
          type="date"
          value={dari}
          onChange={(e) => setDari(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #d7d7d7"
          }}
        />
      </div>

      <div>
        <label style={{ display: "block", fontSize: 12 }}>Ke:</label>
        <input
          type="date"
          value={sampai}
          onChange={(e) => setSampai(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 6,
            border: "1px solid #d7d7d7"
          }}
        />
      </div>
    </div>
  );
}