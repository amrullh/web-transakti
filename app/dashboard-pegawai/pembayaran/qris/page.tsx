'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './qris.module.css';

export default function PembayaranPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pembayaran</h1>

      <p className={styles.descText}>
        Silakan melakukan scan qris
      </p>

      <div className={styles.imageWrapper}>
        <Image
          src="/images"
          alt="Tampilan Qris"
          width={650}
          height={550}
          className={styles.image}
        />
      </div>

      <div className={styles.centerButton}>
        <Link href="/dashboard-pegawai/transaksi">
          <button className={styles.goTransaksiBtn}>Selesai</button>
        </Link>
      </div>
    </div>
  );
}
