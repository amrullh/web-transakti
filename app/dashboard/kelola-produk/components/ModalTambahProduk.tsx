"use client";

import { useState } from "react";
import modal from "../Modal.module.css";
import { ProductType } from "../page";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ModalTambahProduk({
  onClose,
  onSave
}: {
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    nama: "",
    kode_produk: "",
    harga_modal: 0,
    harga_jual: 0,
    stok: 0,
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

    if (!form.nama || form.harga_jual <= 0) {
      alert("Nama dan Harga Jual wajib diisi dengan benar!");
      return;
    }

    setUploading(true);
    try {
      let finalImageUrl = null;

      if (imageFile) {

        const fileName = `products/${Date.now()}_${imageFile.name}`;
        const storageRef = ref(storage, fileName);
        const snapshot = await uploadBytes(storageRef, imageFile);
        finalImageUrl = await getDownloadURL(snapshot.ref);
      }
      onSave({
        nama: form.nama,
        kode_produk: form.kode_produk || null,
        harga_modal: Number(form.harga_modal),
        harga_jual: Number(form.harga_jual),
        stok: Number(form.stok),

        kategori: form.kategori,
        gambar: finalImageUrl
      });

    } catch (error) {
      console.error("Gagal upload:", error);
      alert("Gagal menyimpan produk. Cek koneksi atau izin storage.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={modal.overlay}>
      <div className={modal.modalLarge}>
        <h3 className={modal.modalTitle} style={{ textAlign: "center" }}>Tambah Produk</h3>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: 20, alignItems: "start" }}>

          {/* Kolom Kiri: Input Data */}
          <div>
            <label style={{ display: 'block', marginBottom: 5, fontSize: 14, fontWeight: 600 }}>Nama Produk</label>
            <input
              style={{ width: '100%', padding: 10, marginBottom: 12, borderRadius: 8, border: '1px solid #ccc' }}
              value={form.nama}
              onChange={e => setForm({ ...form, nama: e.target.value })}
            />

            <label style={{ display: 'block', marginBottom: 5, fontSize: 14, fontWeight: 600 }}>Kode Produk (Opsional)</label>
            <input
              style={{ width: '100%', padding: 10, marginBottom: 12, borderRadius: 8, border: '1px solid #ccc' }}
              value={form.kode_produk}
              onChange={e => setForm({ ...form, kode_produk: e.target.value })}
            />

            <label style={{ display: 'block', marginBottom: 5, fontSize: 14, fontWeight: 600 }}>Harga Modal</label>
            <input
              type="number"
              style={{ width: '100%', padding: 10, marginBottom: 12, borderRadius: 8, border: '1px solid #ccc' }}
              value={form.harga_modal}
              onChange={e => setForm({ ...form, harga_modal: Number(e.target.value) })}
            />

            <label style={{ display: 'block', marginBottom: 5, fontSize: 14, fontWeight: 600 }}>Harga Jual</label>
            <input
              type="number"
              style={{ width: '100%', padding: 10, marginBottom: 12, borderRadius: 8, border: '1px solid #ccc' }}
              value={form.harga_jual}
              onChange={e => setForm({ ...form, harga_jual: Number(e.target.value) })}
            />

            <label style={{ display: 'block', marginBottom: 5, fontSize: 14, fontWeight: 600 }}>Stok</label>
            <input
              type="number"
              style={{ width: '100%', padding: 10, marginBottom: 12, borderRadius: 8, border: '1px solid #ccc' }}
              value={form.stok}
              onChange={e => setForm({ ...form, stok: Number(e.target.value) })}
            />

            <label style={{ display: 'block', marginBottom: 5, fontSize: 14, fontWeight: 600 }}>Kategori</label>
            <select
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #ccc' }}
              value={form.kategori}
              onChange={e => setForm({ ...form, kategori: e.target.value as any })}
            >
              <option value="Makanan">Makanan</option>
              <option value="Minuman">Minuman</option>
            </select>
          </div>

          {/* Kolom Kanan: Upload Gambar */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 150,
              height: 150,
              background: '#f1f5f9',
              borderRadius: 12,
              margin: '0 auto 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              border: '1px dashed #ccc'
            }}>
              {form.gambar_preview ?
                <img src={form.gambar_preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Preview" /> :
                <span style={{ color: '#999', fontSize: 12 }}>Preview Gambar</span>
              }
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={uploadChange}
              style={{ fontSize: 12 }}
            />
          </div>
        </div>

        <div className={modal.modalButtons} style={{ marginTop: 20 }}>
          <button
            className={modal.btnSecondary}
            onClick={onClose}
            disabled={uploading}
          >
            Batal
          </button>

          <button
            className={modal.btnPrimary}
            onClick={handleSave}
            disabled={uploading}
            style={{ opacity: uploading ? 0.7 : 1 }}
          >
            {uploading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}