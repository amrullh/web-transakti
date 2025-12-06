// app/dashboard/pembayaran/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Eye, Trash2, X } from "lucide-react";
import "./pembayaran.css";
import { db } from "@/lib/firebase"; // Import db
import { doc, setDoc, getDoc } from "firebase/firestore"; // Import Firestore functions

interface Rekening {
  bank: string;
  norek: string;
  nama: string;
}

const SETTING_DOC_ID = "payment_OUT001"; // ID Dokumen untuk menyimpan pengaturan

export default function Pembayaran() {
  const [isCash, setIsCash] = useState(false); // Diubah defaultnya
  const [isTransfer, setIsTransfer] = useState(false); // Diubah defaultnya
  const [isQris, setIsQris] = useState(false); // Diubah defaultnya
  
  const [qrisImage, setQrisImage] = useState<string | null>(null); 
  const [showQrisPreview, setShowQrisPreview] = useState(false);
  const [rekeningList, setRekeningList] = useState<Rekening[]>([]); 
  const [showModal, setShowModal] = useState(false);
  const [bank, setBank] = useState("");
  const [norek, setNorek] = useState("");
  const [nama, setNama] = useState("");
  const [previewRekening, setPreviewRekening] = useState<Rekening | null>(null);
  const [loading, setLoading] = useState(true); // Tambahkan state loading
  
  const hasRekening = rekeningList.length > 0;

  // Fungsi untuk menyimpan semua pengaturan ke Firestore
  const saveSettings = async (
    cash: boolean,
    transfer: boolean,
    qris: boolean,
    reks: Rekening[],
    qrisImg: string | null
  ) => {
    try {
      const docRef = doc(db, "settings", SETTING_DOC_ID);
      await setDoc(docRef, {
        isCash: cash,
        isTransfer: transfer,
        isQris: qris,
        rekeningList: reks,
        qrisImage: qrisImg, 
      });
    } catch (error) {
      console.error("Gagal menyimpan pengaturan pembayaran:", error);
    }
  };

  // Efek untuk memuat pengaturan saat komponen di-mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "settings", SETTING_DOC_ID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setIsCash(data.isCash ?? true);
          setIsTransfer(data.isTransfer ?? false);
          setIsQris(data.isQris ?? false);
          setRekeningList(data.rekeningList ?? []);
          setQrisImage(data.qrisImage ?? null);
        } else {
          // Set default dan simpan jika dokumen tidak ada
          setIsCash(true);
          await saveSettings(true, false, false, [], null);
        }
      } catch (error) {
        console.error("Gagal memuat pengaturan pembayaran:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  // Handler toggle yang memanggil saveSettings
  const handleToggleCash = async () => {
    const newState = !isCash;
    setIsCash(newState);
    await saveSettings(newState, isTransfer, isQris, rekeningList, qrisImage);
  };

  const handleToggleTransfer = async () => {
    const newState = !isTransfer;
    setIsTransfer(newState);
    await saveSettings(isCash, newState, isQris, rekeningList, qrisImage);
  };
  
  const handleToggleQris = async () => {
    const newState = !isQris;
    setIsQris(newState);
    await saveSettings(isCash, isTransfer, newState, rekeningList, qrisImage);
  };

  // Upload QRIS - simpan base64 ke state dan Firestore
  const handleUploadQRIS = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const imgData = reader.result as string;
      setQrisImage(imgData);
      setIsQris(true); 
      await saveSettings(isCash, isTransfer, true, rekeningList, imgData);
    };
    reader.readAsDataURL(file);
  };

  const handleClearQris = async () => {
      setQrisImage(null);
      setIsQris(false);
      await saveSettings(isCash, isTransfer, false, rekeningList, null);
  }

  // Tambah Rekening - simpan list baru ke state dan Firestore
  const addRekening = async () => {
    if (!bank || !norek || !nama) return alert("Lengkapi semua data!");

    const newRek: Rekening = { bank, norek, nama };
    const updatedReks = [...rekeningList, newRek];
    setRekeningList(updatedReks);

    setBank("");
    setNorek("");
    setNama("");

    setShowModal(false);
    setIsTransfer(true);
    await saveSettings(isCash, true, isQris, updatedReks, qrisImage);
  };

  // Hapus Rekening - simpan list baru ke state dan Firestore
  const deleteRekening = async (index: number) => {
    const updated = rekeningList.filter((_, i) => i !== index);
    setRekeningList(updated);
    const newIsTransfer = updated.length > 0;
    if (!newIsTransfer) setIsTransfer(false);
    await saveSettings(isCash, newIsTransfer, isQris, updated, qrisImage);
  };
  
  const openRekeningPreview = (rek: Rekening) => {
      setPreviewRekening(rek);
  }
  
  // Menampilkan Loading State
  if (loading) {
    return <div className="pembayaran-container"><h1 className="title">Pembayaran</h1><p>Memuat Pengaturan Pembayaran...</p></div>;
  }
  
  return (
    <div className="pembayaran-container">
      <h1 className="title">Pembayaran</h1>

      <div className={`card ${isCash ? "active" : ""}`}>
        <span>Pembayaran Tunai</span>
        <label className="switch">
          <input type="checkbox" checked={isCash} onChange={handleToggleCash} />
          <span className="slider" />
        </label>
      </div>

      <div className={`card ${isTransfer ? "active" : ""}`}>
        <span>Pembayaran Transfer</span>
        <label className="switch">
          <input type="checkbox" checked={isTransfer} onChange={handleToggleTransfer} />
          <span className="slider" />
        </label>
      </div>

      {isTransfer && (
        <div className="transfer-config-area">
          {rekeningList.map((rek, index) => (
            <div className="rekening-summary-item" key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
              <div className="rekening-info-ringkas">
                  <strong>{rek.bank} - {rek.norek}</strong> 
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

      <div className={`card ${isQris ? "active" : ""}`}>
        <span>Pembayaran QRIS</span>
        <label className="switch">
          <input type="checkbox" checked={isQris} onChange={handleToggleQris} />
          <span className="slider" />
        </label>
      </div>

      {isQris && (
        <div className="qris-upload-section">
          {!qrisImage ? (
            <label className="btn-upload">
              Unggah Gambar QRIS
              <input type="file" accept="image/*" onChange={handleUploadQRIS} hidden />
            </label>
          ) : (
            <div className="qris-actions" style={{ display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center' }}>
              <span className="qris-filename">File QRIS Terunggah</span>
              <button className="icon-btn" onClick={() => setShowQrisPreview(true)}>
                <Eye size={22} />
              </button>
              <button className="icon-btn delete" onClick={handleClearQris}>
                <Trash2 size={22} />
              </button>
            </div>
          )}
        </div>
      )}

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
              {/* Menggunakan tag <img> biasa untuk base64 image */}
              <img src={qrisImage} alt="QRIS" style={{ maxWidth: "100%", borderRadius: "12px" }} />
            </div>
          </div>
        </div>
      )}

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