"use client";

import { useState } from "react";
import "./outlet.css";

export default function KelolaOutlet() {
  const [outlets, setOutlets] = useState([
    {
      id: "OUT001",
      nama: "CANTIK MADURA",
      alamat: "Jl. Angkasa Madura",
      kategori: ["Fashion", "Utama"],
      warna: "#f6f7d4"
    },
    {
      id: "OUT002",
      nama: "MAKAN MADURA",
      alamat: "Jl. Angkasa Madura",
      kategori: ["Kuliner", "Utama"],
      warna: "#d6e7ea"
    }
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [selectedOutlet, setSelectedOutlet] = useState<any>(null);

  // 🟦 OPEN ADD
  const openAdd = () => {
    setSelectedOutlet(null);
    setShowAdd(true);
  };

  // 🟦 OPEN EDIT
  const openEdit = (o: any) => {
    setSelectedOutlet(o);
    setShowEdit(true);
  };

  // 🟦 OPEN DELETE CONFIRM
  const openDelete = (o: any) => {
    setSelectedOutlet(o);
    setShowDelete(true);
  };

  return (
    <div className="outlet-wrapper">

      <div className="top-bar">
        <h1>Kelola Outlet</h1>
        <button className="btn-add" onClick={openAdd}>+</button>
      </div>

      <div className="outlet-list">
        {outlets.map((o) => (
          <div key={o.id} className="outlet-card" style={{ background: o.warna }}>
            <div className="outlet-info">
              <h3>{o.nama}</h3>
              <p>{o.alamat}</p>

              <div className="tags">
                {o.kategori.map((k) => (
                  <span key={k} className="tag">{k}</span>
                ))}
              </div>
            </div>

            <div className="actions">
              <button className="edit" onClick={() => openEdit(o)}>✏️</button>
              <button className="delete" onClick={() => openDelete(o)}>🗑️</button>
            </div>
          </div>
        ))}
      </div>


      {/* ================= POPUP ADD ================= */}
      {showAdd && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Tambah Outlet</h3>

            <label>Nama Toko</label>
            <input type="text" placeholder="Masukkan nama toko..." />

            <label>Alamat</label>
            <input type="text" placeholder="Masukkan alamat..." />

            <label>Jenis Bisnis</label>
            <select>
              <option>Fashion dan Gaya Hidup</option>
              <option>Makanan dan Minuman</option>
              <option>Kesehatan dan Kecantikan</option>
              <option>Teknologi dan Digital</option>
              <option>Properti dan Jasa</option>
            </select>

            <label>Kategori</label>
            <select>
              <option>Utama</option>
              <option>Cabang</option>
            </select>

            <button className="btn-submit">Tambah</button>
            <button className="btn-close" onClick={() => setShowAdd(false)}>Tutup</button>
          </div>
        </div>
      )}

      {/* ================= POPUP EDIT ================= */}
      {showEdit && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Edit Outlet</h3>

            <label>Nama Toko</label>
            <input defaultValue={selectedOutlet.nama} />

            <label>Alamat</label>
            <input defaultValue={selectedOutlet.alamat} />

            <label>Jenis Bisnis</label>
            <select defaultValue={selectedOutlet.kategori[0]}>
              <option>Fashion dan Gaya Hidup</option>
              <option>Makanan dan Minuman</option>
              <option>Kesehatan dan Kecantikan</option>
              <option>Teknologi dan Digital</option>
              <option>Properti dan Jasa</option>
            </select>

            <label>Kategori</label>
            <select defaultValue={selectedOutlet.kategori[1]}>
              <option>Utama</option>
              <option>Cabang</option>
            </select>

            <button className="btn-submit">Simpan</button>
            <button className="btn-close" onClick={() => setShowEdit(false)}>Tutup</button>
          </div>
        </div>
      )}

      {/* ================= POPUP DELETE CONFIRM ================= */}
      {showDelete && (
        <div className="popup-overlay">
          <div className="popup-confirm">
            <p>Hapus outlet <b>{selectedOutlet.nama}</b>?</p>

            <div className="confirm-buttons">
              <button className="yes">Hapus</button>
              <button className="no" onClick={() => setShowDelete(false)}>Batal</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
