"use client";

import { useState, useEffect } from "react";
import modal from "../Modal.module.css";
import { ProductType } from "../page";

export default function ModalEditProduk({ data, onClose, onSave }: { data: ProductType; onClose: () => void; onSave: (id: number, payload: Partial<ProductType>) => void; }) {
  const [form, setForm] = useState<ProductType>(data);

  useEffect(() => setForm(data), [data]);

  function uploadChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setForm(s => ({ ...s, gambar: URL.createObjectURL(f) }));
  }

  return (
    <div className={modal.overlay}>
      <div className={modal.modalLarge}>
        <h3 className={modal.modalTitle} style={{ textAlign: "center" }}>Edit Produk</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: 28 }}>
          <div>
            <label style={{ display: "block", marginBottom: 6 }}>Nama Produk</label>
            <input style={{ width: "100%", padding: 10, marginBottom: 12 }} value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} />

            <label style={{ display: "block", marginBottom: 6 }}>Kode Produk (opsional)</label>
            <input style={{ width: "100%", padding: 10, marginBottom: 12 }} value={form.kode_produk ?? ""} onChange={(e) => setForm({ ...form, kode_produk: e.target.value })} />

            <label style={{ display: "block", marginBottom: 6 }}>Harga Modal</label>
            <input type="number" style={{ width: "100%", padding: 10, marginBottom: 12 }} value={form.harga_modal} onChange={(e) => setForm({ ...form, harga_modal: Number(e.target.value) })} />

            <label style={{ display: "block", marginBottom: 6 }}>Harga Jual</label>
            <input type="number" style={{ width: "100%", padding: 10, marginBottom: 12 }} value={form.harga_jual} onChange={(e) => setForm({ ...form, harga_jual: Number(e.target.value) })} />

            <label style={{ display: "block", marginBottom: 6 }}>Stok</label>
            <input type="number" style={{ width: "100%", padding: 10, marginBottom: 12 }} value={form.stok} onChange={(e) => setForm({ ...form, stok: Number(e.target.value) })} />

            <label style={{ display: "block", marginBottom: 6 }}>Kategori</label>
            <select style={{ width: "106%", padding: 10 }} value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value as ProductType["kategori"] })}>
              <option value="Makanan">Makanan</option>
              <option value="Minuman">Minuman</option>
            </select>
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{ width: 150, height: 150, borderRadius: 12, background: "#f1f5f9", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {form.gambar ? <img src={form.gambar} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }} /> : <div style={{ color: "#9aa6b3" }}>Preview</div>}
            </div>
            <input type="file" accept="image/*" onChange={uploadChange} />
          </div>
        </div>

        <div className={modal.modalButtons}>
          <button className={modal.btnSecondary} onClick={onClose}>Batal</button>
          <button className={modal.btnPrimary} onClick={() => { onSave(form.id, { nama: form.nama, kode_produk: form.kode_produk ?? null, harga_modal: form.harga_modal, harga_jual: form.harga_jual, stok: form.stok, kategori: form.kategori, gambar: form.gambar ?? null }); }}>
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
}