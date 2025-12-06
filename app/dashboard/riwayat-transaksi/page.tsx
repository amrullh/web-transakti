"use client";

import { useState, useMemo, useEffect } from "react";
import styles from "./RiwayatTransaksi.module.css";
import Pagination from "../../../components/Pagination";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import modal from "./RiwayatTransaksi.module.css";

export interface DetailItem {
  id_produk: string;
  nama_produk: string;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
  diskon_per_item?: number;
}

export interface TransaksiType {
  id: string;
  id_transaksi_readable?: string;
  tanggal: string;
  waktu: string;
  total: number;
  metode: string;
  kasir: string;
  items: DetailItem[];
  diskon: number;
  pajak: number;
  subtotal_murni: number;
  nama_pelanggan: string;
}

const normalizeMetode = (v: string) =>
  v.toLowerCase()
    .replace("bayar tunai", "cash")
    .replace("tunai", "cash")
    .replace("transfer bank", "transfer")
    .replace("transfer", "transfer")
    .replace("qris", "qris");

const toDate = (x: string) => new Date(x + "T00:00:00");

function FilterRiwayat({
  metode,
  setMetode,
  dari,
  setDari,
  sampai,
  setSampai
}: {
  metode: string;
  setMetode: (v: string) => void;
  dari: string;
  setDari: (v: string) => void;
  sampai: string;
  setSampai: (v: string) => void;
}) {
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

// MODAL DETAIL 
function ModalDetailTransaksi({
  data,
  onClose
}: {
  data: TransaksiType;
  onClose: () => void;
}) {
  return (
    <div className={modal.overlay}>
      <div className={modal.modalLarge} style={{ position: "relative" }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: 16,
            top: 16,
            background: "transparent",
            border: "none",
            fontSize: 18,
            cursor: "pointer",
            color: "#555"
          }}
        >
          ✕
        </button>

        <h3 className={modal.modalTitle} style={{ textAlign: "center", marginBottom: 20 }}>
          DETAIL TRANSAKSI
        </h3>

        <div style={{ display: "flex", gap: 20, marginTop: 12, fontSize: "14px", color: "#333" }}>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 4 }}>
              <strong>ID Transaksi:</strong>{" "}
              <span style={{ fontFamily: "monospace" }}>
                {data.id_transaksi_readable || data.id}
              </span>
            </div>
            <div style={{ marginBottom: 4 }}><strong>Tanggal:</strong> {data.tanggal}</div>
            <div style={{ marginBottom: 4 }}><strong>Kasir:</strong> {data.kasir}</div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 4 }}><strong>Pelanggan:</strong> {data.nama_pelanggan}</div>
            <div style={{ marginBottom: 4 }}><strong>Metode:</strong> {data.metode}</div>
            <div style={{ marginBottom: 4 }}><strong>Waktu:</strong> {data.waktu}</div>
          </div>
        </div>

        {/* Tabel Detail Produk */}
        <div style={{
          maxHeight: "50vh",
          overflowY: "auto",
          marginTop: 16,
          borderRadius: 6,
          border: "1px solid #e5e7eb"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead style={{ background: "#f1f6f8", position: "sticky", top: 0 }}>
              <tr>
                <th style={{ padding: "10px 8px" }}>No</th>
                <th style={{ padding: "10px 8px" }}>Nama Produk</th>
                <th style={{ padding: "10px 8px", textAlign: "right" }}>Jumlah</th>
                <th style={{ padding: "10px 8px", textAlign: "right" }}>Harga</th>
                <th style={{ padding: "10px 8px", textAlign: "right" }}>Diskon</th>
                <th style={{ padding: "10px 8px", textAlign: "right" }}>Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {data.items?.length > 0 ? (
                data.items.map((item, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: 8 }}>{i + 1}</td>
                    <td style={{ padding: 8 }}>{item.nama_produk || (item as any).nama}</td>
                    <td style={{ padding: 8, textAlign: "right" }}>{item.jumlah}</td>
                    <td style={{ padding: 8, textAlign: "right" }}>
                      Rp {(item.harga_satuan || (item as any).harga || 0).toLocaleString("id-ID")}
                    </td>
                    <td
                      style={{
                        padding: 8,
                        textAlign: "right",
                        color: item.diskon_per_item ? "red" : "inherit"
                      }}
                    >
                      {item.diskon_per_item
                        ? `- Rp ${(item.diskon_per_item * item.jumlah).toLocaleString("id-ID")}`
                        : "-"}
                    </td>
                    <td style={{ padding: 8, textAlign: "right", fontWeight: 500 }}>
                      Rp {item.subtotal.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} style={{ padding: 20, textAlign: "center" }}>Detail item tidak tersedia</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 280, fontSize: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span>Subtotal</span>
              <span>
                Rp {(data.subtotal_murni ?? (data.total + data.diskon - data.pajak)).toLocaleString("id-ID")}
              </span>
            </div>

            {data.diskon > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, color: "#d32f2f" }}>
                <span>Diskon</span>
                <span>- Rp {data.diskon.toLocaleString("id-ID")}</span>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span>Pajak</span>
              <span>Rp {data.pajak.toLocaleString("id-ID")}</span>
            </div>

            <div style={{
              marginTop: 12,
              paddingTop: 10,
              borderTop: "2px solid #e5e7eb",
              fontWeight: 700,
              display: "flex",
              justifyContent: "space-between",
              color: "#205781"
            }}>
              <span>Total</span>
              <span>Rp {data.total.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// MAIN PAGE
export default function RiwayatTransaksiPage() {
  const [data, setData] = useState<TransaksiType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "transactions"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            id_transaksi_readable: d.id_transaksi || doc.id.substring(0, 8).toUpperCase(),
            tanggal: d.tanggal,
            waktu: d.waktu,
            total: Number(d.harga_total),
            metode: d.metode,
            kasir: d.kasir || "Unknown",
            nama_pelanggan: d.nama_pelanggan || "-",
            items: d.items || [],
            diskon: Number(d.nilai_diskon_total || 0),
            pajak: Number(d.nilai_pajak_diterapkan || 0),
            subtotal_murni: Number(d.subtotal_transaksi || 0),
          } as TransaksiType;
        });

        setData(fetched);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filters
  const [metodeFilter, setMetodeFilter] = useState("");
  const [dari, setDari] = useState("");
  const [sampai, setSampai] = useState("");
  const [page, setPage] = useState(1);

  const perPage = 10;

  function normalizeMetode(m: string) {
    if (!m) return "";

    const val = m.toLowerCase();

    if (val === "cash") return "Cash";
    if (val === "qris") return "QRIS";
    if (val === "transfer") return "Transfer";

    if (val.includes("tunai")) return "Cash";          
    if (val.includes("qris")) return "QRIS";           
    if (val.includes("transfer")) return "Transfer";   

    return m;
  }

  const filtered = useMemo(() => {
    return data.filter((t) => {
      const metodeDB = normalizeMetode(t.metode);
      const metodeUser = normalizeMetode(metodeFilter);

      if (metodeFilter && metodeDB !== metodeUser) return false;
      if (dari && t.tanggal < dari) return false;
      if (sampai && t.tanggal > sampai) return false;

      return true;
    });
  }, [data, metodeFilter, dari, sampai]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const items = filtered.slice((page - 1) * perPage, page * perPage);

  const [detailOpen, setDetailOpen] = useState<TransaksiType | null>(null);

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <h1 className={styles.title}>Riwayat Transaksi</h1>

        <FilterRiwayat
          metode={metodeFilter}
          setMetode={setMetodeFilter}
          dari={dari}
          setDari={setDari}
          sampai={sampai}
          setSampai={setSampai}
        />
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID Transaksi</th>
              <th>Tanggal & Waktu</th>
              <th>Kasir</th>
              <th>Pelanggan</th>
              <th>Metode</th>
              <th>Total Bayar</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: 20 }}>
                  Memuat data...
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.empty}>
                  Tidak ada data transaksi
                </td>
              </tr>
            ) : (
              items.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontFamily: "monospace", fontWeight: "bold" }}>
                    #{t.id_transaksi_readable}
                  </td>

                  <td>
                    {t.tanggal}{" "}
                    <span style={{ fontSize: "0.85em", color: "#666" }}>({t.waktu})</span>
                  </td>

                  <td>{t.kasir}</td>
                  <td>{t.nama_pelanggan}</td>

                  <td>
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        background:
                          normalizeMetode(t.metode) === "Cash"? "#e0f2fe" 
                            : normalizeMetode(t.metode) === "QRIS"? "#fef3c7"        // kuning muda
                            : "#f0fdf4",       // (Transfer)
                        color:
                          normalizeMetode(t.metode) === "Cash"? "#0369a1"        // biru gelap
                            : normalizeMetode(t.metode) === "QRIS"? "#b45309"        // coklat gelap
                            : "#15803d"        
                      }}
                    >
                      {t.metode}
                    </span>
                  </td>

                  <td style={{ fontWeight: "bold" }}>
                    Rp {t.total.toLocaleString("id-ID")}
                  </td>

                  <td>
                    <button
                      className={styles.btnDetail}
                      onClick={() => setDetailOpen(t)}
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.paginationWrap}>
        <Pagination current={page} total={totalPages} onChange={setPage} />
      </div>

      {detailOpen && (
        <ModalDetailTransaksi data={detailOpen} onClose={() => setDetailOpen(null)} />
      )}
    </div>
  );
}