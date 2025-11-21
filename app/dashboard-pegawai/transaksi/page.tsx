'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import styles from './transaksi.module.css';
import { FiTrash2 } from "react-icons/fi";

type Product = {
  id: number;
  nama: string;
  harga_jual: number;
  stok: number;
  gambar: string;
  isActive: boolean;
  kategori: "Makanan" | "Minuman";
};

type CartItem = Product & { qty: number };

const products: Product[] = [
  { id: 1, nama: "Mie Goreng", harga_jual: 12000, stok: 10, gambar: "/images/mieGoreng.png", isActive: true, kategori: "Makanan" },
  { id: 2, nama: "Mie Iblis", harga_jual: 15000, stok: 8, gambar: "/images/mieIblis.png", isActive: true, kategori: "Makanan" },
  { id: 3, nama: "Es Teh Manis", harga_jual: 6000, stok: 20, gambar: "/images/default.jpg", isActive: false, kategori: "Minuman" },
  { id: 4, nama: "Es Milo", harga_jual: 12000, stok: 12, gambar: "/images/esMilo.png", isActive: true, kategori: "Minuman" },
  { id: 5, nama: "Ayam Geprek", harga_jual: 22000, stok: 6, gambar: "/images/ayamGeprek.png", isActive: true, kategori: "Makanan" },
  { id: 6, nama: "Nasi Kuning", harga_jual: 16000, stok: 7, gambar: "/images/default.jpg", isActive: false, kategori: "Makanan" },
];

export default function TransaksiPage() {
  const [stockProducts, setStockProducts] = useState<Product[]>(products);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState("Semua");
  const [paymentMethod, setPaymentMethod] = useState("Bayar Tunai");
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const filteredProducts = stockProducts
    .filter((p) => p.isActive)
    .filter((p) => p.nama.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => kategori === "Semua" ? true : p.kategori === kategori);

  const addToCart = (product: Product) => {
    if (product.stok <= 0) return;

    setStockProducts((prev) =>
      prev.map((p) =>
        p.id === product.id ? { ...p, stok: p.stok - 1 } : p
      )
    );

    setCart((prev) => {
      const exist = prev.find((p) => p.id === product.id);
      if (exist) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: number, qty: number) => {
    const newQty = Number(qty);
    if (newQty < 1) return;

    const cartItem = cart.find((i) => i.id === id);
    if (!cartItem) return;

    const product = stockProducts.find((p) => p.id === id);
    if (!product) return;

    const maxQty = cartItem.qty + product.stok;
    if (newQty > maxQty) return;

    const selisih = newQty - cartItem.qty;

    setStockProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stok: p.stok - selisih } : p
      )
    );

    setCart((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, qty: newQty } : p
      )
    );
  };

  const removeItem = (id: number) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;

    setStockProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, stok: p.stok + item.qty } : p
      )
    );

    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => {
    cart.forEach((item) => {
      setStockProducts((prev) =>
        prev.map((p) =>
          p.id === item.id ? { ...p, stok: p.stok + item.qty } : p
        )
      );
    });
    setCart([]);
  };

  const subtotal = cart.reduce((sum, p) => sum + p.qty * p.harga_jual, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  // 🚀 LOGIKA BARU — PENCARIAN + SCAN BARCODE (ID)
  const handleSearchInput = (value: string) => {
    setSearch(value);

    const scanned = stockProducts.find(
      (p) => p.id.toString() === value.trim()
    );

    if (scanned) {
      addToCart(scanned);
      setTimeout(() => setSearch(""), 300);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.header}>
          <h1 className={styles.title}>Transaksi</h1>

          <div className={styles.searchRow}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Cari / Scan Produk"
              value={search}
              onChange={(e) => handleSearchInput(e.target.value)}
            />

            <select
              className={styles.filterSelect}
              value={kategori}
              onChange={(e) => setKategori(e.target.value)}
            >
              <option>Semua</option>
              <option>Makanan</option>
              <option>Minuman</option>
            </select>
          </div>
        </div>

        <div className={styles.productList}>
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className={styles.productCard}
              onClick={() => addToCart(p)}
            >
              <Image
                src={p.gambar}
                alt={p.nama}
                width={120}
                height={90}
                className={styles.productImg}
              />
              <p className={styles.productName}>{p.nama}</p>
              <p className={styles.productPrice}>Rp {p.harga_jual.toLocaleString()}</p>
              <p className={styles.productStock}>Stok: {p.stok}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.right}>
        <h2 className={styles.belanjaTitle}>Daftar Belanja</h2>

        <div className={styles.cartWrapper}>
          {cart.length === 0 && <p className={styles.emptyText}>Belum ada produk</p>}

          {cart.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <div className={styles.cartTop}>
                <p className={styles.cartName}>{item.nama}</p>
                <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>×</button>
              </div>

              <div className={styles.cartBottom}>
                <input
                  type="number"
                  min="1"
                  className={styles.qtyInput}
                  value={item.qty}
                  onChange={(e) => updateQty(item.id, Number(e.target.value))}
                />

                <p className={styles.cartPrice}>
                  Rp {(item.qty * item.harga_jual).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.priceInfo}>
          <p>Subtotal: Rp {subtotal.toLocaleString()}</p>
          <p>Pajak (10%): Rp {tax.toLocaleString()}</p>
          <h3 className={styles.totalHarga}>Total: Rp {total.toLocaleString()}</h3>
        </div>

        <FiTrash2
          className={styles.trashBtn}
          onClick={() => setShowDeletePopup(true)}
        />

        <select
          className={styles.selectPayment}
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option>Bayar Tunai</option>
          <option>Bayar Qris</option>
          <option>Transfer</option>
        </select>

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
            <h3 className={styles.popupTitle}>Hapus semua transaksi?</h3>
            <div className={styles.popupActions}>
              <button
                className={styles.cancelBtn}
                onClick={() => setShowDeletePopup(false)}
              >
                Batal
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => {
                  clearCart();
                  setShowDeletePopup(false);
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
