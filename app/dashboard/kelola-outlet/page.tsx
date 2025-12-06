"use client";

import { useState } from "react";
import "./outlet.css";
import { MdEdit, MdDelete } from "react-icons/md";

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
  const [formNama, setFormNama] = useState("");
  const [formAlamat, setFormAlamat] = useState("");
  const [formJenis, setFormJenis] = useState("");
  const [formKategori, setFormKategori] = useState("");

  const openAdd = () => {
    setSelectedOutlet(null);
    setFormNama("");
    setFormAlamat("");
    setFormJenis("");
    setFormKategori("");

    setShowAdd(true);
  };

  const openEdit = (o: any) => {
    setSelectedOutlet(o);

    setFormNama(o.nama);
    setFormAlamat(o.alamat);
    setFormJenis(o.kategori[0]);
    setFormKategori(o.kategori[1]);

    setShowEdit(true);
  };

  const openDelete = (o: any) => {
    setSelectedOutlet(o);
    setShowDelete(true);
  };

  const handleAdd = () => {
    const newOutlet = {
      id: "OUT" + String(outlets.length + 1).padStart(3, "0"),
      nama: formNama,
      alamat: formAlamat,
      kategori: [formJenis, formKategori],
      warna: "#d6e7ea" 
    };

    setOutlets([...outlets, newOutlet]);
    setShowAdd(false);
  };

  const handleEdit = () => {
    const updated = outlets.map((o) =>
      o.id === selectedOutlet.id
        ? {
            ...o,
            nama: formNama,
            alamat: formAlamat,
            kategori: [formJenis, formKategori]
          }
        : o
    );

    setOutlets(updated);
    setShowEdit(false);
  };

  const handleDelete = () => {
    setOutlets(outlets.filter((o) => o.id !== selectedOutlet.id));
    setShowDelete(false);
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
              <button className="edit" onClick={() => openEdit(o)}>
                <MdEdit size={20} />
              </button>

              <button className="delete" onClick={() => openDelete(o)}>
                <MdDelete size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ADD POPUP */}
      {showAdd && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Tambah Outlet</h3>

            <label>Nama Toko</label>
            <input 
              type="text"
              value={formNama}
              onChange={(e) => setFormNama(e.target.value)}
            />

            <label>Alamat</label>
            <input
              type="text"
              value={formAlamat}
              onChange={(e) => setFormAlamat(e.target.value)}
            />

            <label>Jenis Bisnis</label>
            <select
              value={formJenis}
              onChange={(e) => setFormJenis(e.target.value)}
            >
              <option value="">-- Pilih --</option>
              <option>Fashion dan Gaya Hidup</option>
              <option>Makanan dan Minuman</option>
              <option>Kesehatan dan Kecantikan</option>
              <option>Teknologi dan Digital</option>
              <option>Properti dan Jasa</option>
            </select>

            <label>Kategori</label>
            <select
              value={formKategori}
              onChange={(e) => setFormKategori(e.target.value)}
            >
              <option value="">-- Pilih --</option>
              <option>Utama</option>
              <option>Cabang</option>
            </select>

            <button className="btn-submit" onClick={handleAdd}>Tambah</button>
            <button className="btn-close" onClick={() => setShowAdd(false)}>Tutup</button>
          </div>
        </div>
      )}

      {/* EDIT POPUP */}
      {showEdit && (
        <div className="popup-overlay">
          <div className="popup-card">
            <h3>Edit Outlet</h3>

            <label>Nama Toko</label>
            <input
              value={formNama}
              onChange={(e) => setFormNama(e.target.value)}
            />

            <label>Alamat</label>
            <input
              value={formAlamat}
              onChange={(e) => setFormAlamat(e.target.value)}
            />

            <label>Jenis Bisnis</label>
            <select
              value={formJenis}
              onChange={(e) => setFormJenis(e.target.value)}
            >
              <option>Fashion dan Gaya Hidup</option>
              <option>Makanan dan Minuman</option>
              <option>Kesehatan dan Kecantikan</option>
              <option>Teknologi dan Digital</option>
              <option>Properti dan Jasa</option>
            </select>

            <label>Kategori</label>
            <select
              value={formKategori}
              onChange={(e) => setFormKategori(e.target.value)}
            >
              <option>Utama</option>
              <option>Cabang</option>
            </select>

            <button className="btn-submit" onClick={handleEdit}>Simpan</button>
            <button className="btn-close" onClick={() => setShowEdit(false)}>Tutup</button>
          </div>
        </div>
      )}

      {/* DELETE POPUP */}
      {showDelete && (
        <div className="popup-overlay">
          <div className="popup-confirm">
            <p>Hapus outlet <b>{selectedOutlet?.nama}</b>?</p>

            <div className="confirm-buttons">
              <button className="yes" onClick={handleDelete}>Hapus</button>
              <button className="no" onClick={() => setShowDelete(false)}>Batal</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
