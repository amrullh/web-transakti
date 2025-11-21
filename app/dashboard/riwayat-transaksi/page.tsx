"use client";

import { useState, useMemo } from "react";
import styles from "./RiwayatTransaksi.module.css";
import Pagination from "../../../components/Pagination";
import FilterRiwayat from "./components/FilterRiwayat";
import ModalDetailTransaksi from "./components/ModalDetailTransaksi";

export interface DetailItem {
  id_produk: string;
  nama: string;
  jumlah: number;
  harga: number;
  subtotal: number;
}

export interface TransaksiType {
  id: string;
  tanggal: string;
  waktu: string;
  total: number;
  metode: string;
  kasir: string;
  items: DetailItem[];
  diskon: number;
  pajak: number;
  total_bayar: number;
}

export default function RiwayatTransaksiPage() {
    const [data] = useState<TransaksiType[]>([
    {
        id: "TRX-007",
        tanggal: "2025-01-25",
        waktu: "17:10",
        total: 45000,
        metode: "Cash",
        kasir: "Dita",
        diskon: 0,
        pajak: 0,
        total_bayar: 45000,
        items: [
        { id_produk: "P003", nama: "Es Teh", jumlah: 3, harga: 5000, subtotal: 15000 },
        { id_produk: "P002", nama: "Nasi Goreng", jumlah: 1, harga: 30000, subtotal: 30000 }
        ],
    },
    {
        id: "TRX-006",
        tanggal: "2025-01-25",
        waktu: "15:44",
        total: 78000,
        metode: "QRIS",
        kasir: "Ana",
        diskon: 3000,
        pajak: 5000,
        total_bayar: 80000,
        items: [
        { id_produk: "P001", nama: "Mie Goreng", jumlah: 2, harga: 20000, subtotal: 40000 },
        { id_produk: "P004", nama: "Teh Botol", jumlah: 2, harga: 8000, subtotal: 16000 },
        { id_produk: "P006", nama: "Kerupuk", jumlah: 2, harga: 6000, subtotal: 12000 },
        ],
    },
    {
        id: "TRX-005",
        tanggal: "2025-01-24",
        waktu: "13:20",
        total: 30000,
        metode: "Transfer",
        kasir: "Rian",
        diskon: 0,
        pajak: 0,
        total_bayar: 30000,
        items: [
        { id_produk: "P002", nama: "Nasi Goreng", jumlah: 1, harga: 30000, subtotal: 30000 }
        ],
    },
    {
        id: "TRX-004",
        tanggal: "2025-01-23",
        waktu: "11:15",
        total: 52000,
        metode: "QRIS",
        kasir: "Dita",
        diskon: 0,
        pajak: 2000,
        total_bayar: 54000,
        items: [
        { id_produk: "P007", nama: "Ayam Geprek", jumlah: 1, harga: 25000, subtotal: 25000 },
        { id_produk: "P003", nama: "Es Teh", jumlah: 2, harga: 5000, subtotal: 10000 },
        { id_produk: "P006", nama: "Kerupuk", jumlah: 2, harga: 6000, subtotal: 12000 },
        ],
    },
    {
        id: "TRX-003",
        tanggal: "2025-01-21",
        waktu: "12:44",
        total: 150000,
        metode: "QRIS",
        kasir: "Ana",
        diskon: 0,
        pajak: 10000,
        total_bayar: 160000,
        items: [
        { id_produk: "P001", nama: "Mie Goreng", jumlah: 2, harga: 20000, subtotal: 40000 },
        { id_produk: "P003", nama: "Es Teh", jumlah: 3, harga: 5000, subtotal: 15000 },
        { id_produk: "P002", nama: "Nasi Goreng", jumlah: 2, harga: 30000, subtotal: 60000 },
        ],
    },
    {
        id: "TRX-002",
        tanggal: "2025-01-20",
        waktu: "10:22",
        total: 90000,
        metode: "Cash",
        kasir: "Dita",
        diskon: 0,
        pajak: 0,
        total_bayar: 90000,
        items: [
        { id_produk: "P005", nama: "Ayam Geprek", jumlah: 2, harga: 30000, subtotal: 60000 },
        { id_produk: "P003", nama: "Es Teh", jumlah: 3, harga: 5000, subtotal: 15000 },
        ],
    },
    {
        id: "TRX-001",
        tanggal: "2025-01-19",
        waktu: "09:50",
        total: 18000,
        metode: "Transfer",
        kasir: "Rian",
        diskon: 0,
        pajak: 0,
        total_bayar: 18000,
        items: [
        { id_produk: "P003", nama: "Es Teh", jumlah: 2, harga: 5000, subtotal: 10000 },
        { id_produk: "P006", nama: "Kerupuk", jumlah: 1, harga: 8000, subtotal: 8000 },
        ],
    },
    ]);

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
              <th>Tanggal</th>
              <th>Waktu</th>
              <th>Total</th>
              <th>Metode</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.tanggal}</td>
                <td>{t.waktu}</td>
                <td>Rp {t.total.toLocaleString("id-ID")}</td>
                <td>{t.metode}</td>
                <td>
                  <button
                    className={styles.btnDetail}
                    onClick={() => setDetailOpen(t)}
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td colSpan={6} className={styles.empty}>
                  Tidak ada data
                </td>
              </tr>
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