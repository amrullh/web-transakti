'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './transfer.module.css';

export default function PembayaranPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pembayaran</h1>

      <p className={styles.descText}>Silakan melakukan transfer</p>

      {/* === KOTAK TRANSFER === */}
        <div className={styles.transferBox}>
          <div className={styles.infoRek}>
            <p className={styles.bankName}>Bank BCA</p>
            <p className={styles.noRek}>0123 456 7890</p>
            <p className={styles.namaRek}>a.n. Punya Toko</p>
          </div>
        </div>

      <div className={styles.centerButton}>
        <Link href="/dashboard-pegawai/transaksi">
          <button className={styles.goTransaksiBtn}>Selesai</button>
        </Link>
      </div>
    </div>
  );
}
