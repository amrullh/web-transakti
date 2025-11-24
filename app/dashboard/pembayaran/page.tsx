"use client";

import React, { useState } from "react";
import { Eye, Trash2, X } from "lucide-react";
import "./pembayaran.css";

interface Rekening {
  bank: string;
  norek: string;
  nama: string;
}

export default function Pembayaran() {
  const [isCash, setIsCash] = useState(true);
  const [isTransfer, setIsTransfer] = useState(false);
  const [isQris, setIsQris] = useState(true);

  // QRIS
  const [qrisImage, setQrisImage] = useState<string | null>(null);
  const [showQrisPreview, setShowQrisPreview] = useState(false);

  const [rekeningList, setRekeningList] = useState<Rekening[]>([]); 
  
  const [showModal, setShowModal] = useState(false);

  const [bank, setBank] = useState("");
  const [norek, setNorek] = useState("");
  const [nama, setNama] = useState("");

  const [previewRekening, setPreviewRekening] = useState<Rekening | null>(null);
  
  const hasRekening = rekeningList.length > 0;

  // Upload QRIS
  const handleUploadQRIS = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setQrisImage(reader.result as string);
    reader.readAsDataURL(file);
    setIsQris(true); 
  };

  // Tambah Rekening
  const addRekening = () => {
    if (!bank || !norek || !nama) return alert("Lengkapi semua data!");

    const newRek: Rekening = { bank, norek, nama };
    setRekeningList([...rekeningList, newRek]);

    setBank("");
    setNorek("");
    setNama("");

    setShowModal(false);
    setIsTransfer(true);
  };

  // Hapus Rekening
  const deleteRekening = (index: number) => {
    const updated = rekeningList.filter((_, i) => i !== index);
    setRekeningList(updated);
    if (updated.length === 0) setIsTransfer(false); 
  };
  
  const openRekeningPreview = (rek: Rekening) => {
      setPreviewRekening(rek);
  }
  
  // ======================================
  // LOGIKA UTAMA RENDER
  // ======================================

  return (
    <div className="pembayaran-container">
      <h1 className="title">Pembayaran</h1>

      {/* === Tunai === */}
      <div className={`card ${isCash ? "active" : ""}`}>
        <span>Pembayaran Tunai</span>
        <label className="switch">
          <input type="checkbox" checked={isCash} onChange={() => setIsCash(!isCash)} />
          <span className="slider" />
        </label>
      </div>

      {/* === Transfer === */}
      <div className={`card ${isTransfer ? "active" : ""}`}>
        <span>Pembayaran Transfer</span>
        <label className="switch">
          <input type="checkbox" checked={isTransfer} onChange={() => setIsTransfer(!isTransfer)} />
          <span className="slider" />
        </label>
      </div>

      {/* ====== AREA KONFIGURASI TRANSFER ====== */}
      {isTransfer && (
        <div className="transfer-config-area">
          {rekeningList.map((rek, index) => (
            <div className="rekening-summary-item" key={index}>
              <div className="rekening-info-ringkas">
                  <strong>{rek.bank}</strong> 
                  <span className="rek-detail">{rek.norek} — {rek.nama}</span>
              </div>
              <div className="rekening-actions">
                <button 
                    className="icon-btn" 
                  
                    onClick={() => openRekeningPreview(rek)}
                >
                  <Eye size={22} />
                </button>
                <button 
                    className="icon-btn delete" 
                    onClick={() => deleteRekening(index)}
                >
                  <Trash2 size={22} />
                </button>
              </div>
            </div>
          ))}

          <button 
              className="btn-rekening" 
              onClick={() => setShowModal(true)}
              style={{ marginTop: hasRekening ? '10px' : '0' }}
          >
            + Tambah Nomor Rekening
          </button>
        </div>
      )}


      {/* ====== QRIS ====== */}
      <div className={`card ${isQris ? "active" : ""}`}>
        <span>Pembayaran QRIS</span>
        <label className="switch">
          <input type="checkbox" checked={isQris} onChange={() => setIsQris(!isQris)} />
          <span className="slider" />
        </label>
      </div>

      {isQris && (
        <div className="qris-upload-section">
          {!qrisImage ? (
            <label className="btn-upload">
              ⬆ Unggah Gambar QRIS
              <input type="file" accept="image/*" onChange={handleUploadQRIS} hidden />
            </label>
          ) : (
            <div className="qris-actions">
              <span className="qris-filename">File QRIS Terunggah</span>
              <button className="icon-btn" onClick={() => setShowQrisPreview(true)}>
                <Eye size={22} />
              </button>
              <button className="icon-btn delete" onClick={() => setQrisImage(null)}>
                <Trash2 size={22} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ==== POPUP PREVIEW QRIS ==== */}
      {showQrisPreview && qrisImage && (
        <div className="modal-overlay" onClick={() => setShowQrisPreview(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>QRIS Preview</h2>
              <button className="close-btn" onClick={() => setShowQrisPreview(false)}>
                <X size={26} />
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: "center" }}>
              <img src={qrisImage} alt="QRIS" style={{ maxWidth: "100%", borderRadius: "12px" }} />
            </div>
          </div>
        </div>
      )}

      {/* ==== POPUP TAMBAH REKENING (Modal Input) ==== */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>TAMBAH REKENING</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <X size={26} />
              </button>
            </div>

            <div className="modal-body">
              <label>Bank</label>
              <select className="input" value={bank} onChange={(e) => setBank(e.target.value)}>
                <option value="">Pilih Bank</option>
                <option value="BCA">BCA</option>
                <option value="BRI">BRI</option>
                <option value="BNI">BNI</option>
                <option value="Mandiri">Mandiri</option>
              </select>

              <label>Nomor Rekening</label>
              <input
                className="input"
                value={norek}
                onChange={(e) => setNorek(e.target.value)}
                placeholder="Masukkan Nomor Rekening"
              />

              <label>Nama</label>
              <input
                className="input"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Atas Nama"
              />

              <button className="btn-submit" onClick={addRekening}>
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==== POPUP PREVIEW/DETAIL REKENING (Modal Output) ==== */}
      {previewRekening !== null && (
        <div className="modal-overlay" onClick={() => setPreviewRekening(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>DETAIL REKENING</h2>
              <button className="close-btn" onClick={() => setPreviewRekening(null)}>
                <X size={26} />
              </button>
            </div>

            <div className="modal-body">
              <p><strong>Bank:</strong> {previewRekening.bank}</p>
              <p><strong>No. Rekening:</strong> {previewRekening.norek}</p>
              <p><strong>Atas Nama:</strong> {previewRekening.nama}</p>
              <button className="btn-submit" onClick={() => setPreviewRekening(null)} style={{ marginTop: 20 }}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}