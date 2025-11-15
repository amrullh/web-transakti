
import React from 'react';
import Image from 'next/image';
import styles from './LaporanPenjualan.module.css';
import SummaryCard from '../../../components/reports/SummaryCard';
import SalesChart from '../../../components/reports/SalesChart';


const dummySalesDetails = [
    { tanggal: '2025-09-03', jumlahTransaksi: 17, totalPenjualan: 857000 },
    { tanggal: '2025-09-04', jumlahTransaksi: 63, totalPenjualan: 387000 },
    { tanggal: '2025-09-05', jumlahTransaksi: 26, totalPenjualan: 765000 },
    { tanggal: '2025-09-06', jumlahTransaksi: 33, totalPenjualan: 700000 },
    { tanggal: '2025-09-07', jumlahTransaksi: 21, totalPenjualan: 199000 },
    { tanggal: '2025-09-08', jumlahTransaksi: 15, totalPenjualan: 563000 },
];


export default function LaporanPenjualanPage() {
    return (
        <div className={styles.pageContainer}>
            {/* 1. Header Halaman */}
            <h1 className={styles.header}>Laporan Penjualan</h1>

            {/* 2. Filter Bar  */}
            <div className={styles.filterBar}>
                <div className={styles.filterPeriod}>
                    <div>
                        <label className={styles.label}>Periode</label>
                        <button className={styles.button}>Bulan September</button>
                    </div>
                    <button className={styles.button}>01 Sep 2025 - 30 Sep 2025</button>
                </div>
                <button className={styles.buttonPrimary}>Coto Dg Salabas</button>
            </div>

            {/* 3. Grid Dashboard Utama (2 Kolom) */}
            <div className={styles.dashboardGrid}>

                {/* Kolom Kiri (Berisi semua kartu) */}
                <div className={styles.leftColumn}>

                    <div className={styles.summaryCardGrid}>
                        <SummaryCard title="Total Penjualan" value="Rp 8.230.000" />
                        <SummaryCard title="Total Transaksi" value="234" />
                        <SummaryCard title="Laba Kotor" value="Rp 6.620.000" />
                        <SummaryCard title="Total Produk" value="357" />
                    </div>

                    <div className={styles.topProductCard}>
                        <h3 className={styles.cardHeader}>Produk Terlaris</h3>
                        <div className={styles.productInfo}>
                            <Image
                                src="/images/pangsit.png"
                                alt="Pangsit Goreng"
                                width={80}
                                height={80}
                                className={styles.productImage}
                            />
                            <div>
                                <p className={styles.productName}>PANGSIT GORENG</p>
                                <p className={styles.productSales}>600 Penjualan/Bulan</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.rightColumn}>
                    <SalesChart />
                </div>

            </div>

            {/* 4. Tabel Detail Penjualan (Tidak berubah) */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            <th>Jumlah Transaksi</th>
                            <th style={{ textAlign: 'right' }}>Total Penjualan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dummySalesDetails.map((item, index) => (
                            <tr key={index}>
                                <td>{item.tanggal}</td>
                                <td>{item.jumlahTransaksi}</td>
                                <td style={{ textAlign: 'right' }}>
                                    Rp {item.totalPenjualan.toLocaleString('id-ID')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
