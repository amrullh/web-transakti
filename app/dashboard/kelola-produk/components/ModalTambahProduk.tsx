"use client";

import { useState } from "react";
import modal from "../Modal.module.css";
import { ProductType } from "../page";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ModalTambahProduk({ onClose, onSave }: any) {
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    nama: "",
    kode_produk: "",
    harga_modal: "" as string | number,
    harga_jual: "" as string | number,
    stok: "" as string | number,
    kategori: "Makanan" as ProductType["kategori"],
    gambar_preview: "" as string | null
  });

  function uploadChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setImageFile(f);
      setForm(s => ({ ...s, gambar_preview: URL.createObjectURL(f) }));
    }
  }

  const handleSave = async () => {
    if (!form.nama || Number(form.harga_jual) <= 0) {
      alert("Nama dan Harga Jual wajib diisi dengan benar!");
      return;
    }

    setUploading(true);

    try {
      let finalImageUrl = null;

      if (imageFile) {
        const fileName = `products/${Date.now()}_${imageFile.name}`;
        const snapshot = await uploadBytes(ref(storage, fileName), imageFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      }

      onSave({
        nama: form.nama,
        kode_produk: form.kode_produk || null,
        harga_modal: Number(form.harga_modal || 0),
        harga_jual: Number(form.harga_jual || 0),
        stok: Number(form.stok || 0),
        kategori: form.kategori,
        gambar: finalImageUrl
      });

    } catch (err) {
      alert("Gagal menyimpan produk.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={modal.overlay}>
      <div className={modal.modalLarge}>
        <h3 className={modal.modalTitle} style={{ textAlign: "center" }}>
          Tambah Produk
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 180px",
            gap: 28
          }}
        >
          {/* Input kiri */}
          <div>
            <label style={{ display: "block", marginBottom: 6 }}>Nama Produk</label>
            <input
              style={{ width: "100%", padding: 10, marginBottom: 12 }}
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
            />

            <label style={{ display: "block", marginBottom: 6 }}>Kode Produk (opsional)</label>
            <input
              style={{ width: "100%", padding: 10, marginBottom: 12 }}
              value={form.kode_produk}
              onChange={(e) => setForm({ ...form, kode_produk: e.target.value })}
            />

            <label style={{ display: "block", marginBottom: 6 }}>Harga Modal</label>
            <input
              type="number"
              style={{ width: "100%", padding: 10, marginBottom: 12 }}
              value={form.harga_modal}
              onChange={(e) => {
                const v = e.target.value;
                setForm({ ...form, harga_modal: v === "" ? "" : Number(v) });
              }}
            />

            <label style={{ display: "block", marginBottom: 6 }}>Harga Jual</label>
            <input
              type="number"
              style={{ width: "100%", padding: 10, marginBottom: 12 }}
              value={form.harga_jual}
              onChange={(e) => {
                const v = e.target.value;
                setForm({ ...form, harga_jual: v === "" ? "" : Number(v) });
              }}
            />

            <label style={{ display: "block", marginBottom: 6 }}>Stok</label>
            <input
              type="number"
              style={{ width: "100%", padding: 10, marginBottom: 12 }}
              value={form.stok}
              onChange={(e) => {
                const v = e.target.value;
                setForm({ ...form, stok: v === "" ? "" : Number(v) });
              }}
            />

            <label style={{ display: "block", marginBottom: 6 }}>Kategori</label>
            <select
              style={{ width: "105%", padding: 10 }}
              value={form.kategori}
              onChange={(e) =>
                setForm({ ...form, kategori: e.target.value as ProductType["kategori"] })
              }
            >
              <option value="Makanan">Makanan</option>
              <option value="Minuman">Minuman</option>
            </select>
          </div>

          {/* Preview kanan */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 150,
                height: 150,
                borderRadius: 12,
                background: "#f1f5f9",
                margin: "0 auto 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden"
              }}
            >
              {form.gambar_preview ? (
                <img
                  src={form.gambar_preview}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ color: "#9aa6b3" }}>Preview</div>
              )}
            </div>

            <input type="file" accept="image/*" onChange={uploadChange} />
          </div>
        </div>

        {/* Tombol */}
        <div className={modal.modalButtons}>
          <button className={modal.btnSecondary} onClick={onClose} disabled={uploading}>
            Batal
          </button>

          <button
            className={modal.btnPrimary}
            onClick={handleSave}
            disabled={uploading}
          >
            {uploading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}