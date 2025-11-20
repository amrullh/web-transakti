// File: app/dashboard/kelola-produk/ModalProduk.tsx

import React, { useState } from 'react';
import { IProduk } from 'src/types/produk'; 
import styles from './kelolaProduk.module.css'; 

// --- DEFINISI TIPE UNTUK MODAL DASAR ---
interface IModalProps {
  buka: boolean;
  tutup: () => void;
  judul?: string;
  children?: React.ReactNode;
}

interface IModalProdukProps {
  buka: boolean;
  tutup: () => void;
  dataProdukEdit: IProduk | null; 
}

// --- Komponen Dasar Modal ---
const Modal: React.FC<IModalProps> = ({ buka, tutup, judul, children }) => {
  if (!buka) return null;
  return (
    <div className={styles.overlay} onClick={tutup}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.popupHeader}>
          <h3 className={styles.modalTitle}>{judul}</h3>
          <button className={styles.closeBtn} onClick={tutup}>×</button>
        </div>
        <div className={styles.popupBody}>
            {children}
        </div>
      </div>
    </div>
  );
};


// --- Komponen Modal Produk Utama ---
const ModalProduk: React.FC<IModalProdukProps> = ({ buka, tutup, dataProdukEdit = null }) => {
  const modeEdit = !!dataProdukEdit;
  
  const [punyaBarcode, setPunyaBarcode] = useState(modeEdit ? !!dataProdukEdit?.kodeProduk : false);
  const [tampilPertanyaanBarcode, setTampilPertanyaanBarcode] = useState(!modeEdit);

  const [dataForm, setDataForm] = useState({ 
    // Mengacu langsung ke dataProdukEdit (sumber data) jika ada, jika tidak, pakai nilai default ('')
    namaProduk: dataProdukEdit?.nama || '',
    kodeProduk: dataProdukEdit?.kodeProduk || '',
    hargaModal: dataProdukEdit?.hargaModal || 0,
    hargaJual: dataProdukEdit?.hargaJual || 0,
    stok: dataProdukEdit?.stok || 0,
    // FIX: Mengacu ke dataProdukEdit untuk nilai kategori
    kategori: dataProdukEdit?.kategori || '', 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDataForm({ ...dataForm, [e.target.name]: e.target.value });
  };

  const handleSimpan = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Data yang disimpan:', dataForm);
    tutup();
    if (!modeEdit) {
        setTampilPertanyaanBarcode(true); 
    }
  };

  const renderPertanyaanBarcode = () => (
    <div className={styles.barcodeQuestion}>
      <p className={styles.barcodeQuestionText}>Apakah produk Anda memiliki barcode?</p>
      <div className={styles.barcodeQuestionActions}>
        <button 
            onClick={() => { setPunyaBarcode(true); setTampilPertanyaanBarcode(false); }} 
            className={styles.barcodeYesBtn}
        >
            YA
        </button>
        <button 
            onClick={() => { setPunyaBarcode(false); setTampilPertanyaanBarcode(false); }} 
            className={styles.barcodeNoBtn}
        >
            TIDAK
        </button>
      </div>
    </div>
  );

  const renderFormProduk = () => (
    <form onSubmit={handleSimpan} className={styles.produkForm}>
      
      {/* Kolom Kiri - Data Produk (SEMUA INPUT DIJAMIN ADA) */}
      <div className={styles.formSectionLeft}>
        <input name="namaProduk" placeholder="Nama Produk" value={dataForm.namaProduk} onChange={handleChange} required className={styles.formInput} />
        
        {punyaBarcode && (
          <input name="kodeProduk" placeholder="Kode Produk (Scan Barcode)" value={dataForm.kodeProduk || ''} onChange={handleChange} className={styles.formInput} />
        )}
        
        <input name="hargaModal" placeholder="Harga Modal" value={dataForm.hargaModal} onChange={handleChange} type="number" required className={styles.formInput} />
        <input name="hargaJual" placeholder="Harga Jual" value={dataForm.hargaJual} onChange={handleChange} type="number" required className={styles.formInput} />
        <input name="stok" placeholder="Stok" value={dataForm.stok} onChange={handleChange} type="number" required className={styles.formInput} />
        
        <select name="kategori" value={dataForm.kategori} onChange={handleChange} required className={styles.formInput}>
          <option value="">Pilih Kategori</option>
          <option value="Makanan">Makanan</option>
          <option value="Minuman">Minuman</option>
          <option value="Snack">Snack</option>
        </select>
      </div>

      {/* Kolom Kanan - Gambar */}
      <div className={styles.formSectionRight}>
        <p className={styles.uploadText}>Unggah Gambar Produk</p>
        <div className={styles.imageUploadArea}>
            <p>Klik atau Seret Gambar di sini</p>
            <input type="file" className={styles.fileInput} /> 
        </div>
      </div>

      {/* Tombol Simpan (FOOTER) */}
      <div className={styles.formActionsRight}>
        <button type="submit" className={styles.saveBtn}>
          {modeEdit ? 'Simpan Perubahan' : 'Simpan Produk'}
        </button>
      </div>
    </form>
  );

  return (
    <Modal 
      buka={buka} 
      tutup={tutup} 
      judul={modeEdit ? 'EDIT DATA PRODUK' : 'TAMBAH PRODUK BARU'}
    >
      {modeEdit ? 
        renderFormProduk() : 
        tampilPertanyaanBarcode ? renderPertanyaanBarcode() : renderFormProduk()
      }
    </Modal>
  );
};

export default ModalProduk;