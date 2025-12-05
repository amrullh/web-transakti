"use client";
// app/dashboard/kelola-produk/page.tsx
import { useState, useMemo, useEffect } from "react";
import styles from "./kelolaProduk.module.css";
import FilterDropdown from "./components/FilterDropdown";
import Pagination from "../../../components/Pagination";
import ModalTambahProduk from "./components/ModalTambahProduk";
import ModalEditProduk from "./components/ModalEditProduk";
import ModalHapusProduk from "./components/ModalHapusProduk";
import ModalBarcodeQuestion from "./components/ModalBarcodeQuestion";

export interface ProductType {
  id: string;
  nama: string;
  kode_produk?: string | null;
  harga_modal: number;
  harga_jual: number;
  stok: number;
  gambar_produk?: string | null;
  kategori: "Makanan" | "Minuman";
  status: "Aktif" | "Nonaktif";

  gambar?: string | null;
}

export default function KelolaProdukPage() {

  const [produk, setProduk] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);


  const [search, setSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");


  const perPage = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);


  const [openBarcode, setOpenBarcode] = useState(false);
  const [openTambah, setOpenTambah] = useState(false);
  const [openEditFor, setOpenEditFor] = useState<ProductType | null>(null);
  const [openHapusFor, setOpenHapusFor] = useState<ProductType | null>(null);


  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Gagal mengambil data");

      const data = await res.json();


      const mappedData = data.map((item: any) => ({
        ...item,
        gambar: item.gambar_produk
      }));

      setProduk(mappedData);
    } catch (error) {
      console.error(error);

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchProducts();
  }, []);


  const handleCreate = async (payload: any) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Produk berhasil ditambahkan!");
        setOpenTambah(false);
        fetchProducts();
      } else {
        const err = await res.json();
        alert("Gagal: " + err.error);
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan sistem.");
    }
  };


  const handleUpdate = async (id: string, updated: Partial<ProductType>) => {
    try {

      const payload: any = { ...updated };
      if (payload.gambar !== undefined) {
        payload.gambar_produk = payload.gambar;
        delete payload.gambar;
      }

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert("Produk berhasil diperbarui!");
        setOpenEditFor(null);
        fetchProducts();
      } else {
        alert("Gagal memperbarui produk.");
      }
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan sistem.");
    }
  };


  const handleSoftDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Produk dinonaktifkan.");
        setOpenHapusFor(null);
        fetchProducts();
      } else {
        alert("Gagal menghapus produk.");
      }
    } catch (e) {
      console.error(e);
    }
  };


  const handleActivate = async (id: string) => {

    await handleUpdate(id, { status: "Aktif" } as any);
  };


  const filtered = useMemo(() => {
    return produk.filter(p => {
      if (kategoriFilter && p.kategori !== kategoriFilter) return false;
      if (statusFilter && p.status !== statusFilter) return false;
      if (search && !p.nama.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [produk, search, kategoriFilter, statusFilter]);


  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

  useEffect(() => {
    setCurrentPage(1);
  }, [search, kategoriFilter, statusFilter]);

  const start = (currentPage - 1) * perPage;
  const pageItems = filtered.slice(start, start + perPage);

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

      {/* Loading State */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          Memuat data produk...
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '80px', textAlign: 'center' }}>ID</th>
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
                <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#555' }}>
                  {p.id}
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{p.nama}</div>
                  {p.kode_produk && (
                    <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>
                      Kode: {p.kode_produk}
                    </div>
                  )}
                </td>
                <td>Rp {p.harga_modal.toLocaleString('id-ID')}</td>
                <td>Rp {p.harga_jual.toLocaleString('id-ID')}</td>
                <td>{p.stok}</td>
                <td>
                  <div className={styles.imgBox}>
                    {p.gambar_produk || p.gambar ? (
                      <img
                        src={p.gambar_produk || p.gambar || ""}
                        alt={p.nama}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span className={styles.noImg}>No Image</span>
                    )}
                  </div>
                </td>
                <td>{p.kategori}</td>
                <td>
                  <span className={p.status === "Aktif" ? styles.statusAktif : styles.statusNon}>
                    {p.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button className={styles.btnEdit} onClick={() => setOpenEditFor(p)}>
                      Edit
                    </button>

                    {p.status === "Aktif" ? (
                      <button className={styles.btnHapus} onClick={() => setOpenHapusFor(p)}>
                        Hapus
                      </button>
                    ) : (
                      <button
                        className={styles.btnEdit}
                        style={{ background: "#d1f0e0", color: "#0f7a49" }}
                        onClick={() => handleActivate(p.id)}
                      >
                        Aktif
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {pageItems.length === 0 && (
              <tr>
                <td colSpan={9} className={styles.empty}>
                  Tidak ada produk ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div className={styles.paginationWrap}>
        <Pagination
          current={currentPage}
          total={totalPages}
          onChange={(p) => setCurrentPage(p)}
        />
      </div>

      {/* --- MODALS SECTION --- */}

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
          onSave={handleCreate}
        />
      )}

      {openEditFor && (
        <ModalEditProduk
          data={openEditFor}
          onClose={() => setOpenEditFor(null)}
          onSave={(id, upd) => handleUpdate(String(id), upd)}
        />
      )}

      {openHapusFor && (
        <ModalHapusProduk
          data={openHapusFor}
          onClose={() => setOpenHapusFor(null)}
          onConfirm={() => handleSoftDelete(openHapusFor.id)}
        />
      )}
    </div>
  );
}