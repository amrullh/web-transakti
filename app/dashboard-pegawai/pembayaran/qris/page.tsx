// app/dashboard-pegawai/pembayaran/qris/page.tsx
'use client';
import Image from 'next/image';
import styles from './qris.module.css';
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore'; 
import { db } from "@/lib/firebase"; 
// Diasumsikan komponen ini dibuat di langkah pertama
import ReceiptModal from '../components/ReceiptModal'; 

// Definisikan tipe dan konstanta
const RECEIPT_SETTING_DOC_ID = "receipt_OUT001";
const PAYMENT_SETTING_DOC_ID = "payment_OUT001";

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


export default function PembayaranQrisPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State untuk Struk
  const [showReceipt, setShowReceipt] = useState(false); 
  const [receiptSettings, setReceiptSettings] = useState<ReceiptSettings | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<TransactionData | null>(null);
  
  // State untuk QRIS
  const [qrisImage, setQrisImage] = useState<string | null>(null);
  const [qrisLoading, setQrisLoading] = useState(true);


  // Fungsi untuk menutup struk dan navigasi
  const handleCloseReceipt = () => {
      setShowReceipt(false);
      router.push("/dashboard-pegawai/transaksi"); // Navigasi ke halaman transaksi setelah struk ditutup
  }


  // Ambil Pengaturan Struk dan QRIS Image dari Firestore
  useEffect(() => {
    const fetchSettings = async () => {
        try {
            // Ambil Pengaturan Struk
            const receiptDocRef = doc(db, "settings", RECEIPT_SETTING_DOC_ID);
            const receiptSnap = await getDoc(receiptDocRef);
            
            if (receiptSnap.exists()) {
                const data = receiptSnap.data();
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

            // Ambil QRIS Image
            const paymentDocRef = doc(db, "settings", PAYMENT_SETTING_DOC_ID);
            const paymentSnap = await getDoc(paymentDocRef);
            
            if (paymentSnap.exists()) {
                const data = paymentSnap.data();
                // Ambil image base64 yang disimpan owner
                setQrisImage(data.qrisImage || null); 
            }
        } catch (error) {
            console.error("Gagal memuat pengaturan:", error);
        } finally {
            setQrisLoading(false);
        }
    };
    fetchSettings();
  }, []);


  const handleSelesai = async () => {
    setLoading(true);


    const savedData = localStorage.getItem("temp_transaction");
    if (!savedData) {
      alert("Tidak ada transaksi.");
      router.push("/dashboard-pegawai/transaksi");
      return;
    }
    const transactionData = JSON.parse(savedData) as TransactionData;

    try {

      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...transactionData, outletId: "OUT001" }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);


      // Simpan detail transaksi yang sukses dan tampilkan modal
      alert("Pembayaran QRIS Berhasil.");
      setTransactionDetails(transactionData); 
      setShowReceipt(true); 

      localStorage.removeItem("temp_transaction"); // Hapus dari localStorage

    } catch (error: any) {
      alert("Gagal: " + error.message);
      router.push("/dashboard-pegawai/transaksi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pembayaran</h1>
      <p className={styles.descText}>Silakan scan QRIS di bawah ini</p>

      <div className={styles.imageWrapper}>
        {qrisLoading ? (
            <p>Memuat QRIS Image...</p>
        ) : qrisImage ? (
            <Image 
                src={qrisImage} 
                alt="QRIS Code" 
                width={300} 
                height={300} 
                className={styles.image} 
                // Gunakan unoptimized untuk base64/data URLs
                unoptimized
            />
        ) : (
            <p style={{color: 'red'}}>⚠️ QRIS belum diunggah oleh owner.</p>
        )}
      </div>

      <div className={styles.centerButton}>
        <button
          className={styles.goTransaksiBtn}
          onClick={handleSelesai}
          disabled={loading || !qrisImage} // Disable jika loading atau tidak ada gambar QRIS
        >
          {loading ? "Cek Status..." : "Selesai"}
        </button>
      </div>
      
      {/* Tampilkan Modal Struk */}
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