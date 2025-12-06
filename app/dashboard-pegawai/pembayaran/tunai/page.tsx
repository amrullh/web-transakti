'use client';
// app/dashboard-pegawai/pembayaran/tunai/page.tsx
import Image from 'next/image';
import styles from './tunai.module.css';
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react'; // Tambah useEffect
import ReceiptModal from '../components/ReceiptModal'; // Import komponen baru
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore
import { db } from "@/lib/firebase"; 

// Definisikan tipe untuk settings dan transaction data
const SETTING_DOC_ID = "receipt_OUT001";
interface ReceiptSettings {
    headerText: string;
    footerText: string;
    outletName: string;
    isDiscountEnabled: boolean;
}
interface TransactionData {
    items: any[];
    subtotal: number;
    diskon: number;
    pajak: number;
    total: number;
    customerName: string;
    paymentMethod: string;
    pegawaiInfo: { nama: string };
    tanggal: string; 
}


export default function PembayaranTunaiPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false); // State untuk modal struk
  const [receiptSettings, setReceiptSettings] = useState<ReceiptSettings | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<TransactionData | null>(null);

  // 1. Ambil Pengaturan Struk dari Firestore
  useEffect(() => {
    const fetchSettings = async () => {
        try {
            const docRef = doc(db, "settings", SETTING_DOC_ID);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setReceiptSettings({
                    headerText: data.headerText || 'Terima kasih telah berbelanja.',
                    footerText: data.footerText || 'Kunjungi kami lagi!',
                    outletName: data.outletName || 'Transakti Store',
                    isDiscountEnabled: data.isDiscountEnabled ?? true,
                });
            } else {
                setReceiptSettings({
                    headerText: 'Terima kasih telah berbelanja.',
                    footerText: 'Kunjungi kami lagi!',
                    outletName: 'Transakti Store',
                    isDiscountEnabled: true,
                });
            }
        } catch (error) {
            console.error("Gagal memuat pengaturan struk:", error);
        }
    };
    fetchSettings();
  }, []);

  const handleSelesai = async () => {
    setLoading(true);


    const savedData = localStorage.getItem("temp_transaction");
    if (!savedData) {
      alert("Tidak ada transaksi yang sedang diproses.");
      router.push("/dashboard-pegawai/transaksi");
      return;
    }

    const transactionData = JSON.parse(savedData) as TransactionData;

    try {

      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...transactionData,
          outletId: "OUT001"
        }),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error);


      // 2. Simpan detail transaksi yang sukses dan tampilkan modal
      alert("Pembayaran Tunai Berhasil!");
      setTransactionDetails(transactionData); 
      setShowReceipt(true); 

      // Hapus dari localStorage hanya setelah data tersimpan
      localStorage.removeItem("temp_transaction");

    } catch (error: any) {
      alert("Gagal: " + error.message);
      // Jika gagal, pastikan loading state direset dan data local storage tetap ada
      // atau langsung kembali ke transaksi
      router.push("/dashboard-pegawai/transaksi");
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseReceipt = () => {
      setShowReceipt(false);
      router.push("/dashboard-pegawai/transaksi"); // Navigasi ke halaman transaksi setelah struk ditutup
  }


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pembayaran</h1>
      <p className={styles.descText}>Silakan melakukan pembayaran tunai</p>

      <div className={styles.imageWrapper}>
        <Image src="/images/tunai.png" alt="Ilustrasi Tunai" width={550} height={450} className={styles.image} />
      </div>

      <div className={styles.centerButton}>
        <button
          className={styles.goTransaksiBtn}
          onClick={handleSelesai}
          disabled={loading || !receiptSettings} // Disable jika loading/settings belum terambil
        >
          {loading ? "Memproses..." : "Selesai"}
        </button>
      </div>
      
      {/* 3. Tampilkan Modal Struk */}
      {showReceipt && transactionDetails && receiptSettings && (
          <ReceiptModal
              transaction={transactionDetails}
              settings={receiptSettings}
              onClose={handleCloseReceipt}
          />
      )}
    </div>
  );
}