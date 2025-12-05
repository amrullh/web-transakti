'use client';
// app/dashboard-pegawai/pembayaran/transfer/page.tsx
import styles from './transfer.module.css';
import { useRouter } from "next/navigation";
import { useState } from 'react';

export default function PembayaranTransferPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSelesai = async () => {
    setLoading(true);

    const savedData = localStorage.getItem("temp_transaction");
    if (!savedData) {
      alert("Tidak ada transaksi.");
      router.push("/dashboard-pegawai/transaksi");
      return;
    }
    const transactionData = JSON.parse(savedData);

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...transactionData, outletId: "OUT001" }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      alert("Pembayaran Transfer Berhasil!");
      localStorage.removeItem("temp_transaction");
      router.push("/dashboard-pegawai/transaksi");

    } catch (error: any) {
      alert("Gagal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pembayaran</h1>
      <p className={styles.descText}>Silakan transfer ke rekening berikut:</p>

      <div className={styles.transferBox}>
        <div className={styles.infoRek}>
          <p className={styles.bankName}>Bank BCA</p>
          <p className={styles.noRek}>8830-1234-5678</p>
          <p className={styles.namaRek}>a.n. Transakti Store</p>
        </div>
      </div>

      <div className={styles.centerButton}>
        <button
          className={styles.goTransaksiBtn}
          onClick={handleSelesai}
          disabled={loading}
        >
          {loading ? "Memproses..." : "Selesai"}
        </button>
      </div>
    </div>
  );
}