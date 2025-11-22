'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from './pembayaran.module.css';

export default function PembayaranPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pembayaran</h1>

      <p className={styles.subText}>Belum ada pembayaran</p>
      <p className={styles.descText}>
        Silakan mengisi produk di daftar belanja pada halaman transaksi untuk menghitung harga yang perlu dibayar
      </p>

      <div className={styles.imageWrapper}>
        <Image
          src="/images/pembayaran.png"
          alt="Ilustrasi Pembayaran"
          width={650}
          height={550}
          className={styles.image}
        />
      </div>

      <div className={styles.centerButton}>
        <Link href="/dashboard-pegawai/transaksi">
          <button className={styles.goTransaksiBtn}>Ke halaman transaksi</button>
        </Link>
      </div>
    </div>
  );
}
