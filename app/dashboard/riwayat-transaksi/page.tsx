"use client";
// app/dashboard/riwayat-transaksi/page.tsx
import { useState, useMemo, useEffect } from "react";
import styles from "./RiwayatTransaksi.module.css";
import Pagination from "../../../components/Pagination";
import FilterRiwayat from "./components/FilterRiwayat";
import ModalDetailTransaksi from "./components/ModalDetailTransaksi";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";


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

export default function RiwayatTransaksiPage() {
  const [data, setData] = useState<TransaksiType[]>([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    
    
    const q = query(collection(db, "transactions"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedData = snapshot.docs.map((doc) => {
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
          subtotal_murni: Number(d.subtotal_transaksi || 0)
        } as TransaksiType;
      });

      setData(fetchedData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching transactions:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  
  const [metodeFilter, setMetodeFilter] = useState("");
  const [dari, setDari] = useState("");
  const [sampai, setSampai] = useState("");
  const [page, setPage] = useState(1);

  const perPage = 10;

  const filtered = useMemo(() => {
    return data.filter((t) => {
      if (metodeFilter && t.metode !== metodeFilter) return false;
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
              <tr><td colSpan={7} style={{ textAlign: "center", padding: 20 }}>Memuat data...</td></tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.empty}>
                  Tidak ada data transaksi
                </td>
              </tr>
            ) : (
              items.map((t) => (
                <tr key={t.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                    #{t.id_transaksi_readable}
                  </td>
                  <td>
                    {t.tanggal} <span style={{ color: '#666', fontSize: '0.85em' }}>({t.waktu})</span>
                  </td>
                  <td>{t.kasir}</td>
                  <td>{t.nama_pelanggan}</td>
                  <td>
                    <span style={{
                      padding: "4px 8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      background: t.metode === "Bayar Tunai" ? "#e0f2fe" : "#f0fdf4",
                      color: t.metode === "Bayar Tunai" ? "#0369a1" : "#15803d"
                    }}>
                      {t.metode}
                    </span>
                  </td>
                  <td style={{ fontWeight: 'bold' }}>
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
        <Pagination
          current={page}
          total={totalPages}
          onChange={setPage}
        />
      </div>

      {detailOpen && (
        <ModalDetailTransaksi
          data={detailOpen}
          onClose={() => setDetailOpen(null)}
        />
      )}
    </div>
  );
}