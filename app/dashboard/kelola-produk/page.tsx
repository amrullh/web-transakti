// File: app/dashboard/kelola-produk/page.tsx

"use client";

import React, { useState } from 'react';
import ModalProduk from './ModalProduk'; 
import { IProduk } from 'src/types/produk'; 
import styles from './kelolaProduk.module.css'; // MENGGUNAKAN CSS MODULE
import { FiEdit, FiTrash2 } from "react-icons/fi"; // Menggunakan ikon untuk Edit/Hapus

// --- Data Mockup Produk ---
const daftarProdukAwal: IProduk[] = [
  { id: 'P001', nama: 'Mie Iblis Level 1', kodeProduk: '8992745900010', hargaModal: 9000, hargaJual: 12000, stok: 50, kategori: 'Makanan', status: 'Aktif' },
  { id: 'P002', nama: 'Mie Iblis Level 100', kodeProduk: '8992745900027', hargaModal: 9000, hargaJual: 12000, stok: 40, kategori: 'Makanan', status: 'Nonaktif' },
  { id: 'P003', nama: 'Pangsit Goreng', kodeProduk: null, hargaModal: 7000, hargaJual: 10000, stok: 60, kategori: 'Snack', status: 'Aktif' },
  { id: 'P004', nama: 'Es Tuyul', kodeProduk: null, hargaModal: 5000, hargaJual: 8000, stok: 25, kategori: 'Minuman', status: 'Aktif' },
];

const KelolaProdukPage = () => {
    
    const [modalBuka, setModalBuka] = useState(false);
    const [produkEdit, setProdukEdit] = useState<IProduk | null>(null);
    const [daftarProduk, setDaftarProduk] = useState<IProduk[]>(daftarProdukAwal);

    const handleTambahProduk = () => {
        setProdukEdit(null); 
        setModalBuka(true);
    };

    const handleEditProduk = (produk: IProduk) => {
        setProdukEdit(produk); 
        setModalBuka(true);
    };

    const handleHapusProduk = (id: string) => {
        if (window.confirm('Yakin ingin menonaktifkan produk ini? (Soft Delete)')) {
            setDaftarProduk(daftarProduk.map((p) =>
                p.id === id ? { ...p, status: 'Nonaktif' } : p
            ));
        }
    };

    const formatRupiah = (angka: number): string => {
        return new Intl.NumberFormat('id-ID').format(angka);
    };

    const renderTombolStatus = (status: IProduk['status']) => {
        return ( 
            <span className={`${styles.badge} ${status === 'Aktif' ? styles.badgeAktif : styles.badgeNonaktif}`}>
              {status}
            </span>
        );
    };

    return (
        <div className={styles.produkContainer}>
            <h1 className={styles.title}>Kelola Produk</h1>
            
            {/* Area Pencarian, Filter, dan Tombol Tambah */}
            <div className={styles.headerWrapper}>
                <div className={styles.searchFilter}>
                    <input type="text" placeholder="Cari nama barang..." className={styles.searchInput} />
                    <button className={styles.filterBtn}>Filter</button>
                </div>
                
                <button onClick={handleTambahProduk} className={styles.addBtn}>
                    + Tambahkan Produk Baru
                </button>
            </div>

            {/* Implementasi Tabel Daftar Produk */}
            <div className={styles.tableWrapper}>
                <table className={styles.produkTable}>
                    <thead>
                        <tr>
                            <th>ID Produk</th>
                            <th>Nama Produk</th>
                            <th>Harga Jual</th>
                            <th>Stok</th>
                            <th>Kategori</th>
                            <th>Status</th>
                            <th>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {daftarProduk.map((produk) => (
                            <tr key={produk.id}>
                                <td>{produk.id}</td>
                                <td>{produk.nama}</td>
                                <td>Rp {formatRupiah(produk.hargaJual)}</td>
                                <td>{produk.stok}</td>
                                <td>{produk.kategori}</td>
                                <td>
                                    {renderTombolStatus(produk.status)}
                                </td>
                                <td>
                                    <FiEdit onClick={() => handleEditProduk(produk)} className={styles.actionIcon} />
                                    <FiTrash2 onClick={() => handleHapusProduk(produk.id)} className={styles.actionIconRed} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Paginasi (sesuai desain BRD) */}
            <div className={styles.pagination}>
                <span>&lt; Sebelum</span>
                <span className={styles.currentPage}>01</span>
                <span>Setelan &gt;</span>
            </div>

            {/* Modal Tambah/Edit Produk */}
            <ModalProduk 
                buka={modalBuka} 
                tutup={() => setModalBuka(false)} 
                dataProdukEdit={produkEdit}
            />
        </div>
    );
};

export default KelolaProdukPage;