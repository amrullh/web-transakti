//app/dashboard-pegawai/transaksi/page.tsx
"use client";

import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import styles from './transaksi.module.css';
import { FiTrash2 } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Product = {
  id: string;
  nama: string;
  harga_jual: number;
  stok: number;
  gambar?: string;
  gambar_produk?: string;
  status: "Aktif" | "Nonaktif";
  kategori: "Makanan" | "Minuman";
  kode_produk?: string;
};

type Promo = {
  id: string;
  nama_promo: string;
  jenis_promo: "Persentase (%)" | "Nominal (Rp)";
  nilai: number;
  produk_ids?: string[];
  produk_terkait?: string[];
};

type CartItem = Product & { qty: number; diskonPerItem: number };

export default function TransaksiPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);

  const [employeeName, setEmployeeName] = useState("Pegawai");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState("Semua");
  const [paymentMethod, setPaymentMethod] = useState("Bayar Tunai");
  const [showDeletePopup, setShowDeletePopup] = useState(false);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const resProd = await fetch('/api/products');
        if (resProd.ok) {
          const dataProd = await resProd.json();
          const activeProducts = dataProd.filter((p: any) => p.status === "Aktif");
          setProducts(activeProducts);
        }

        const resPromo = await fetch('/api/promos/active');
        if (resPromo.ok) {
          const dataPromo = await resPromo.json();
          setPromos(dataPromo);
        }

        if (user?.uid) {
          const userDocRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();

            if (userData.nama) {
              setEmployeeName(userData.nama);
            }
          }
        }

      } catch (err) {
        console.error("Gagal ambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);


  const checkPromo = (product: Product): number => {
    if (!promos || promos.length === 0) return 0;

    const promoById = promos.find(p =>
      p.produk_ids && p.produk_ids.includes(String(product.id))
    );

    const applicablePromo = promoById;

    if (!applicablePromo) return 0;

    if (applicablePromo.jenis_promo === "Persentase (%)") {
      return (product.harga_jual * applicablePromo.nilai) / 100;
    } else {
      return applicablePromo.nilai;
    }
  };

  const filteredProducts = products
    .filter((p) => p.nama.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => kategori === "Semua" ? true : p.kategori === kategori);


  const addToCart = (product: Product) => {
    const currentInCart = cart.find(i => i.id === product.id)?.qty || 0;
    if (product.stok - currentInCart <= 0) {
      alert("Stok habis!");
      return;
    }
    const discountValue = checkPromo(product);
    setCart((prev) => {
      const exist = prev.find((p) => p.id === product.id);
      if (exist) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1, diskonPerItem: discountValue }];
    });
  };

  const updateQty = (id: string, qty: number) => {
    const newQty = Number(qty);
    if (newQty < 1) return;
    const product = products.find((p) => p.id === id);
    if (product && newQty > product.stok) {
      alert("Stok tidak cukup!");
      return;
    }
    setCart((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, qty: newQty } : p
      )
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setShowDeletePopup(false);
  };

  const handleSearchInput = (value: string) => {
    setSearch(value);
    const scanned = products.find(
      (p) => String(p.id) === value.trim() || (p.kode_produk && p.kode_produk === value.trim())
    );
    if (scanned) {
      addToCart(scanned);
      setSearch("");
    }
  };


  const subtotal = cart.reduce((sum, p) => sum + (p.qty * p.harga_jual), 0);
  const totalDiskon = cart.reduce((sum, p) => sum + (p.qty * p.diskonPerItem), 0);
  const afterDiscount = subtotal - totalDiskon;
  const tax = afterDiscount * 0.1;
  const total = afterDiscount + tax;

  const handleBayar = () => {
    if (cart.length === 0) {
      alert("Keranjang kosong!");
      return;
    }

    const transactionData = {
      items: cart,
      subtotal,
      diskon: totalDiskon,
      pajak: tax,
      total,
      customerName,
      paymentMethod,
      tanggal: new Date().toISOString(),
      pegawaiInfo: {
        uid: user?.uid || "guest",

        nama: employeeName
      }
    };

    localStorage.setItem("temp_transaction", JSON.stringify(transactionData));

    if (paymentMethod === "Bayar Tunai") {
      router.push("/dashboard-pegawai/pembayaran/tunai");
    } else if (paymentMethod === "Bayar Qris") {
      router.push("/dashboard-pegawai/pembayaran/qris");
    } else if (paymentMethod === "Transfer") {
      router.push("/dashboard-pegawai/pembayaran/transfer");
    }
  };

  return (
    <div className={styles.container}>

      {/* KIRI: PRODUK */}
      <div className={styles.left}>
        <div className={styles.header}>
          <h1 className={styles.title}>Transaksi</h1>
          <p style={{ fontSize: 14, color: '#666', marginTop: -10, marginBottom: 20 }}>
            Kasir: <strong>{employeeName}</strong>
          </p>

          <div className={styles.searchRow}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Cari Nama / Scan Barcode..."
              value={search}
              onChange={(e) => handleSearchInput(e.target.value)}
              autoFocus
            />
            <select
              className={styles.filterSelect}
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
            >
              <option value="Semua">Semua</option>
              <option value="Makanan">Makanan</option>
              <option value="Minuman">Minuman</option>
            </select>
          </div>
        </div>

        <div className={styles.productList}>
          {loading ? (
            <div style={{ padding: 20, color: '#666' }}>Sedang memuat data...</div>
          ) : filteredProducts.length === 0 ? (
            <div style={{ padding: 20, color: '#666' }}>Produk tidak ditemukan.</div>
          ) : (
            filteredProducts.map((p) => (
              <div key={p.id} className={styles.productCard} onClick={() => addToCart(p)}>

                {/* 1. BAGIAN GAMBAR */}
                <div className={styles.productImgWrapper}>
                  <Image
                    src={p.gambar || p.gambar_produk || "/images/no-image.png"}
                    alt={p.nama}
                    fill
                    className={styles.productImg}
                    unoptimized={true}
                    onError={(e) => { e.currentTarget.src = "/images/no-image.png" }}
                    // Tambahkan style objectFit agar gambar tidak memaksa container
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* 2. BAGIAN KONTEN (REVISI AGAR COMPACT) */}
                {/* Kita gunakan style inline flex column agar isinya rapat ke atas */}
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>

                  {/* Nama Produk */}
                  <p className={styles.productName} style={{ marginBottom: '0', lineHeight: '1.3' }}>
                    {p.nama}
                  </p>

                  {/* Harga & Stok (Sebaris) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p className={styles.productPrice} style={{ margin: 0 }}>
                      Rp {p.harga_jual.toLocaleString('id-ID')}
                    </p>
                    <p className={styles.productStock} style={{ fontSize: '11px', color: '#888', margin: 0 }}>
                      Stok: {p.stok}
                    </p>
                  </div>

                  {/* Promo Badge (Hanya muncul jika ada promo) */}
                  {/* Kita hapus placeholder kosong yg bikin panjang */}
                  {checkPromo(p) > 0 && (
                    <div className={styles.promoBadge} style={{ alignSelf: 'flex-start', marginTop: '2px' }}>
                      Diskon Rp {checkPromo(p).toLocaleString('id-ID')}
                    </div>
                  )}

                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* KANAN: KERANJANG */}
      <div className={styles.right}>
        <h2 className={styles.belanjaTitle}>Daftar Belanja</h2>
        <div className={styles.cartWrapper}>
          {cart.length === 0 && <p className={styles.emptyText}>Belum ada produk</p>}
          {cart.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ width: '50px', height: '50px', flexShrink: 0, borderRadius: '6px', overflow: 'hidden', border: '1px solid #eee' }}>
                  <Image
                    src={item.gambar || item.gambar_produk || "/images/no-image.png"}
                    alt={item.nama}
                    width={50}
                    height={50}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    unoptimized={true}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <div className={styles.cartTop}>
                    <p className={styles.cartName} style={{ margin: 0, fontSize: '14px', lineHeight: '1.2' }}>{item.nama}</p>
                    <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>×</button>
                  </div>
                  {item.diskonPerItem > 0 && (
                    <span style={{ fontSize: '10px', color: 'green', display: 'block', marginTop: '2px' }}>
                      Hemat Rp {item.diskonPerItem.toLocaleString('id-ID')} / item
                    </span>
                  )}
                </div>
              </div>
              <div className={styles.cartBottom}>
                <input
                  type="number"
                  min="1"
                  className={styles.qtyInput}
                  value={item.qty}
                  onChange={(e) => updateQty(item.id, Number(e.target.value))}
                />
                <div style={{ textAlign: 'right' }}>
                  {item.diskonPerItem > 0 && (
                    <span style={{ fontSize: 11, textDecoration: 'line-through', color: '#999', display: 'block' }}>
                      Rp {(item.qty * item.harga_jual).toLocaleString('id-ID')}
                    </span>
                  )}
                  <p className={styles.cartPrice}>
                    Rp {(item.qty * (item.harga_jual - item.diskonPerItem)).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.infoTransaksi}>
          <div className={styles.priceInfo}>
            <p>Subtotal: Rp {subtotal.toLocaleString('id-ID')}</p>
            {totalDiskon > 0 && (
              <p style={{ color: 'green', fontWeight: 'bold' }}>Hemat: -Rp {totalDiskon.toLocaleString('id-ID')}</p>
            )}
            <p>Pajak (10%): Rp {tax.toLocaleString('id-ID')}</p>
            <h3 className={styles.totalHarga}>Total: Rp {total.toLocaleString('id-ID')}</h3>
          </div>
          <FiTrash2 className={styles.trashBtn} onClick={() => setShowDeletePopup(true)} />
        </div>

        <div className={styles.choosePay}>
          <p>Pilih metode pembayaran:</p>
        </div>

        <select className={styles.selectPayment} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option>Bayar Tunai</option>
          <option>Bayar Qris</option>
          <option>Transfer</option>
        </select>

        <button className={styles.btnPayment} onClick={handleBayar}>
          Bayar Sekarang
        </button>

        <input
          type="text"
          className={styles.customerInput}
          placeholder="Nama Pelanggan (Opsional)"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </div>

      {showDeletePopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.popupBox}>
            <h3 className={styles.popupTitle}>Hapus semua pesanan?</h3>
            <div className={styles.popupActions}>
              <button className={styles.cancelBtn} onClick={() => setShowDeletePopup(false)}>Batal</button>
              <button className={styles.deleteBtn} onClick={clearCart}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}