// app/dashboard-pegawai/pembayaran/transfer/page.tsx
'use client';
import styles from './transfer.module.css';
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from "@/lib/firebase"; 
import ReceiptModal from '../components/ReceiptModal';

const RECEIPT_SETTING_DOC_ID = "receipt_OUT001";
const PAYMENT_SETTING_DOC_ID = "payment_OUT001";

interface Rekening {
    bank: string;
    norek: string;
    nama: string;
}

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

export default function PembayaranTransferPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false); 
  const [receiptSettings, setReceiptSettings] = useState<ReceiptSettings | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<TransactionData | null>(null);
  const [rekeningList, setRekeningList] = useState<Rekening[]>([]);
  const [rekeningLoading, setRekeningLoading] = useState(true);

  const handleCloseReceipt = () => {
      setShowReceipt(false);
      router.push("/dashboard-pegawai/transaksi");
  }

  useEffect(() => {
    const fetchSettings = async () => {
        try {
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

            const paymentDocRef = doc(db, "settings", PAYMENT_SETTING_DOC_ID);
            const paymentSnap = await getDoc(paymentDocRef);
            
            if (paymentSnap.exists()) {
                const data = paymentSnap.data();
                setRekeningList(data.rekeningList || []); 
            }
        } finally {
            setRekeningLoading(false);
        }
    };
    fetchSettings();
  }, []);
  
  const selectedRekening = rekeningList.length > 0 ? rekeningList[0] : null;

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

      alert("Pembayaran Transfer Berhasil!");
      setTransactionDetails(transactionData); 
      setShowReceipt(true); 

      localStorage.removeItem("temp_transaction");

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
      <p className={styles.descText}>Silakan transfer ke rekening berikut:</p>

      <div className={styles.transferBox}>
        <div className={styles.infoRek}>
          {rekeningLoading ? (
            <p>Memuat info rekening...</p>
          ) : selectedRekening ? (
            <>
              <p className={styles.bankName}>Bank {selectedRekening.bank}</p>
              <p className={styles.noRek}>{selectedRekening.norek}</p>
              <p className={styles.namaRek}>a.n. {selectedRekening.nama}</p>
            </>
          ) : (
             <p style={{color: 'red'}}>⚠️ Belum ada rekening transfer yang diatur oleh owner.</p>
          )}
        </div>
      </div>

      <div className={styles.centerButton}>
        <button
          className={styles.goTransaksiBtn}
          onClick={handleSelesai}
          disabled={loading || !selectedRekening}
        >
          {loading ? "Memproses..." : "Selesai"}
        </button>
      </div>

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
