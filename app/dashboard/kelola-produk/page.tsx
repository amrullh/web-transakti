// File: app/dashboard/kelola-produk/page.tsx

"use client";

import React, { useState } from 'react';
import ModalProduk from './ModalProduk'; 
import { IProduk } from 'src/types/produk'; // FIX: Menggunakan path src/types/produk
import styles from './kelolaProduk.module.css'; 
import Sidebar from '@/components/Sidebar'; 
import { FiEdit, FiTrash2 } from "react-icons/fi";

// --- Data Mockup Produk ---
const daftarProdukAwal: IProduk[] = [
  { id: 'P001', nama: 'Mie Iblis Level 1', kodeProduk: '8992745900010', hargaModal: 9000, hargaJual: 12000, stok: 50, kategori: 'Makanan', status: 'Aktif' },
  { id: 'P002', nama: 'Mie Iblis Level 100', kodeProduk: '8992745900027', hargaModal: 9000, hargaJual: 12000, stok: 40, kategori: 'Makanan', status: 'Nonaktif' },
  { id: 'P003', nama: 'Pangsit Goreng', kodeProduk: null, hargaModal: 7000, hargaJual: 10000, stok: 60, kategori: 'Snack', status: 'Aktif' },
  { id: 'P004', nama: 'Es Tuyul', kodeProduk: null, hargaModal: 5000, hargaJual: 8000, stok: 25, kategori: 'Minuman', status: 'Aktif' },
];

// --- Komponen Dropdown Filter ---
const FilterDropdown = ({ onClose }: { onClose: () => void }) => {
    // FIX: Komponen Dropdown Filter sudah dibuat di sini
    return (
        <div className={styles.filterDropdown} onMouseLeave={onClose}>
            <button className={styles.dropdownItem}>Kategori</button>
            <button className={styles.dropdownItem}>Status</button>
        </div>
    );
};


const KelolaProdukPage = () => {
    
    const [modalBuka, setModalBuka] = useState(false);
    const [produkEdit, setProdukEdit] = useState<IProduk | null>(null);
    const [daftarProduk, setDaftarProduk] = useState<IProduk[]>(daftarProdukAwal);
    const [showFilter, setShowFilter] = useState(false); 

    const handleTambahProduk = () => {
        setProdukEdit(null); 
        setModalBuka(true);
    };

    const handleEditProduk = (produk: IProduk) => {
        setProdukEdit(produk); 
        setModalBuka(true);
    };

    const handleHapusProduk = (id: string) => {
        // Logika Soft Delete
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
        <div className="flex min-h-screen">
            
            <main className="flex-1 ml-64 p-8 bg-gray-50"> 
                <h1 className={styles.title}>Kelola Produk</h1>
                
                {/* Area Pencarian, Filter, dan Tombol Tambah */}
                <div className={styles.headerWrapper}>
                    <div className={styles.searchFilter}>
                        <input type="text" placeholder="Cari nama barang..." className={styles.searchInput} />
                        
                        {/* Tombol Filter yang memicu dropdown */}
                        <div style={{ position: 'relative' }}>
                            <button 
                                className={styles.filterBtn}
                                onClick={() => setShowFilter(!showFilter)}
                            >
                                Filter
                            </button>
                            {showFilter && <FilterDropdown onClose={() => setShowFilter(false)} />}
                        </div>
                    </div>
                    
                    <button onClick={handleTambahProduk} className={styles.addBtn}>
                        + Tambahkan Produk Baru
                    </button>
                </div>

                {/* Implementasi Tabel Daftar Produk */}
                <div className={styles.tableWrapper}>
                    <table className={styles.produkTable}>
                        <thead className={styles.tableHead}>
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
                                    <td className={styles.actionColumn}>
                                        <FiEdit onClick={() => handleEditProduk(produk)} className={styles.actionIcon} />
                                        <FiTrash2 onClick={() => handleHapusProduk(produk.id)} className={styles.actionIconRed} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Kontrol Paginasi (FIXED: Typo dan Bisa Diklik) */}
                <div className={styles.pagination}>
                    <a onClick={() => console.log('Sebelum')}>&lt; Sebelum</a>
                    <span className={styles.currentPage}>01</span>
                    <a onClick={() => console.log('Sesudah')}>Sesudah &gt;</a>
                </div>

                {/* Modal Tambah/Edit Produk */}
                <ModalProduk 
                    buka={modalBuka} 
                    tutup={() => setModalBuka(false)} 
                    dataProdukEdit={produkEdit}
                />
            </main>
        </div>
    );
};

export default KelolaProdukPage;