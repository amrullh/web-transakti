"use client";

import { useState, useMemo, useEffect } from "react";
import styles from "./kelolaProduk.module.css";
import FilterDropdown from "./components/FilterDropdown";
import Pagination from "../../../components/Pagination";
import ModalTambahProduk from "./components/ModalTambahProduk";
import ModalEditProduk from "./components/ModalEditProduk";
import ModalHapusProduk from "./components/ModalHapusProduk";
import ModalBarcodeQuestion from "./components/ModalBarcodeQuestion";

/** Product type */
export interface ProductType {
  id: number;
  nama: string;
  kode_produk?: string | null;
  harga_modal: number;
  harga_jual: number;
  stok: number;
  gambar?: string | null;
  kategori: "Makanan" | "Minuman";
  status: "Aktif" | "Nonaktif";
}

export default function KelolaProdukPage() {
  // initial dummy data
  const [produk, setProduk] = useState<ProductType[]>([
    { id: 1, nama: "Mie Goreng", kode_produk: "0001", harga_modal: 7000, harga_jual: 12000, stok: 10, gambar: null, kategori: "Makanan", status: "Aktif" },
    { id: 2, nama: "Mie Iblis", kode_produk: "0002", harga_modal: 8000, harga_jual: 15000, stok: 8, gambar: null, kategori: "Makanan", status: "Aktif" },
    { id: 3, nama: "Es Teh Manis", kode_produk: null, harga_modal: 2000, harga_jual: 6000, stok: 20, gambar: null, kategori: "Minuman", status: "Aktif" },
    { id: 4, nama: "Es Milo", kode_produk: null, harga_modal: 5000, harga_jual: 12000, stok: 12, gambar: null, kategori: "Minuman", status: "Nonaktif" },
    { id: 5, nama: "Ayam Geprek", kode_produk: "0005", harga_modal: 12000, harga_jual: 22000, stok: 6, gambar: null, kategori: "Makanan", status: "Aktif" },
    { id: 6, nama: "Nasi Kuning", kode_produk: "0006", harga_modal: 9000, harga_jual: 16000, stok: 7, gambar: null, kategori: "Makanan", status: "Aktif" }
  ]);

  // filters / search
  const [search, setSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // pagination
  const perPage = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);

  // modals
  const [openBarcode, setOpenBarcode] = useState(false);
  const [openTambah, setOpenTambah] = useState(false);
  const [openEditFor, setOpenEditFor] = useState<ProductType | null>(null);
  const [openHapusFor, setOpenHapusFor] = useState<ProductType | null>(null);

  // filtered list
  const filtered = useMemo(() => {
    return produk.filter(p => {
      if (kategoriFilter && p.kategori !== kategoriFilter) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      if (search && !p.nama.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [produk, search, kategoriFilter, statusFilter]);

  // pages
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  // slice visible
  const start = (currentPage - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

// CRUD handlers (local state)
const handleCreate = (payload: Omit<ProductType, "id" | "status"> & { status?: ProductType["status"] }) => {
  const nextId = produk.length ? Math.max(...produk.map(p => p.id)) + 1 : 1;
  const next: ProductType = {
    id: nextId,
    status: "Aktif",
    ...payload
  } as ProductType;
  
  // 1. Tambahkan item baru ke list yang sudah ada
  const newList = [...produk, next]; 

  // 2. Urutkan seluruh list berdasarkan ID (numerik)
  // Menggunakan sort dengan fungsi komparasi numerik (a.id - b.id)
  newList.sort((a, b) => a.id - b.id);
  
  setProduk(newList);
  setCurrentPage(1);
};

  const handleUpdate = (id: number, updated: Partial<ProductType>) => {
    setProduk(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p));
  };

  // soft delete -> set status to Tidak Aktif
  const handleSoftDelete = (id: number) => {
    setProduk(prev => prev.map(p => p.id === id ? { ...p, status: "Nonaktif" } : p));
  };

  // reactivate
  const handleActivate = (id: number) => {
    setProduk(prev => prev.map(p => p.id === id ? { ...p, status: "Aktif" } : p));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Kelola Produk</h1>

      <div className={styles.topRow}>
        <input
          className={styles.searchBar}
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <FilterDropdown
          kategoriFilter={kategoriFilter}
          setKategoriFilter={setKategoriFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        <button className={styles.btnTambah} onClick={() => setOpenBarcode(true)}>
          + Tambah Produk
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID Produk</th>
            <th>Nama Produk</th>
            <th>Harga Modal</th>
            <th>Harga Jual</th>
            <th>Stok</th>
            <th>Gambar</th>
            <th>Kategori</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {pageItems.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.nama}</td>
              <td>{p.harga_modal}</td>
              <td>{p.harga_jual}</td>
              <td>{p.stok}</td>
              <td>
                <div className={styles.imgBox}>
                  {p.gambar ? <img src={p.gambar} alt={p.nama} /> : <span className={styles.noImg}>No Image</span>}
                </div>
              </td>
              <td>{p.kategori}</td>
              <td>
                <span className={p.status === "Aktif" ? styles.statusAktif : styles.statusNon}>{p.status}</span>
              </td>
              <td>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className={styles.btnEdit} onClick={() => setOpenEditFor(p)}>Edit</button>

                  {p.status === "Aktif" ? (
                    <button className={styles.btnHapus} onClick={() => setOpenHapusFor(p)}>Hapus</button>
                  ) : (
                    <button
                      className={styles.btnEdit}
                      style={{ background: "#d1f0e0" }}
                      onClick={() => handleActivate(p.id)}
                    >
                      Aktifkan
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}

          {pageItems.length === 0 && (
            <tr>
              <td colSpan={9} className={styles.empty}>Tidak ada produk</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className={styles.paginationWrap}>
        <Pagination current={currentPage} total={totalPages} onChange={(p) => setCurrentPage(p)} />
      </div>

      {/* modals */}
      {openBarcode && (
        <ModalBarcodeQuestion
          onClose={() => setOpenBarcode(false)}
          onChoose={(withBarcode) => {
            setOpenBarcode(false);
            setOpenTambah(true);
          }}
        />
      )}

      {openTambah && (
        <ModalTambahProduk
          onClose={() => setOpenTambah(false)}
          onSave={(payload) => {
            handleCreate(payload);
            setOpenTambah(false);
          }}
        />
      )}

      {openEditFor && (
        <ModalEditProduk
          data={openEditFor}
          onClose={() => setOpenEditFor(null)}
          onSave={(id, upd) => {
            handleUpdate(id, upd);
            setOpenEditFor(null);
          }}
        />
      )}

      {openHapusFor && (
        <ModalHapusProduk
          data={openHapusFor}
          onClose={() => setOpenHapusFor(null)}
          onConfirm={() => {
            handleSoftDelete(openHapusFor.id);
            setOpenHapusFor(null);
          }}
        />
      )}
    </div>
  );
}