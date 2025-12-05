'use client';
// app/dashboard-pegawai/pembayaran/tunai/page.tsx
import Image from 'next/image';
import styles from './qris.module.css';
import { useRouter } from "next/navigation";
import { useState } from 'react';

export default function PembayaranQrisPage() {
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


      alert("Pembayaran QRIS Berhasil.");
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
      <p className={styles.descText}>Silakan scan QRIS di bawah ini</p>

      <div className={styles.imageWrapper}>
        <Image src="/images/pembayaran.png" alt="QRIS Code" width={300} height={300} className={styles.image} />
      </div>

      <div className={styles.centerButton}>
        <button
          className={styles.goTransaksiBtn}
          onClick={handleSelesai}
          disabled={loading}
        >
          {loading ? "Cek Status..." : "Selesai"}
        </button>
      </div>
    </div>
  );
}