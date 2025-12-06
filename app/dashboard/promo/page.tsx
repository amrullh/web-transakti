"use client";

import React, { useState, useEffect } from 'react';
import styles from './Promo.module.css';
import ModalPilihProduk from './components/ModalPilihProduk';


type PromoData = {
  id: string;
  nama_promo: string;
  jenis_promo: string;
  nilai: number;
  produk_display: string;
  produk_ids?: string[];
  tanggal_mulai: string;
  tanggal_selesai: string;
  status_aktif: boolean;
};

export default function PromoPage() {
  const [promos, setPromos] = useState<PromoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);


  const [showProductModal, setShowProductModal] = useState(false);


  const [form, setForm] = useState({
    nama: "",
    produk_display: "",
    produk_ids: [] as string[],
    tanggal_mulai: "",
    tanggal_berakhir: "",
    tipe: "Persentase (%)",
    nilai: ""
  });


  const fetchPromos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/promos');
      if (res.ok) {
        const data = await res.json();
        setPromos(data);
      }
    } catch (error) {
      console.error("Gagal ambil promo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, []);


  const getStatus = (startDate: string, endDate: string) => {
    const now = new Date().toISOString().split('T')[0];
    if (now >= startDate && now <= endDate) {
      return "Active";
    } else if (now > endDate) {
      return "Expired";
    } else {
      return "Upcoming";
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.nilai || !form.tanggal_mulai || !form.tanggal_berakhir) {
      alert("Mohon lengkapi data promo!");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          produk: form.produk_display
        })
      });

      if (res.ok) {
        alert("Promo berhasil disimpan!");

        setForm({
          nama: "",
          produk_display: "",
          produk_ids: [],
          tanggal_mulai: "",
          tanggal_berakhir: "",
          tipe: "Persentase (%)",
          nilai: ""
        });
        fetchPromos();
      } else {
        alert("Gagal menyimpan promo.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };


  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus promo ini?")) return;
    try {
      const res = await fetch(`/api/promos/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert("Promo dihapus.");
        fetchPromos();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.header}>Promosi & Diskon</h1>
      <div className={styles.cardContainer}>

        <p className={styles.instruction}>
          Tambahkan promo baru dengan mengisi form singkat di bawah ini.
        </p>

        <form className={styles.formGrid} onSubmit={handleSubmit}>
          {/* Nama Promo */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Nama Promo</label>
            <input
              type="text"
              placeholder="Diskon Weekend"
              className={styles.input}
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
            />
          </div>

          {/* Pilih Produk (ReadOnly + Tombol) */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Produk yang Didiskon</label>
            <div className={styles.inputWithButton}>
              <input
                type="text"
                placeholder="Klik tombol + Produk -->"
                className={styles.input}
                value={form.produk_display}
                readOnly
                style={{ backgroundColor: '#f9fafb', cursor: 'default', textOverflow: 'ellipsis' }}
                title={form.produk_display}
              />
              <button
                type="button"
                className={styles.buttonSecondary}
                onClick={() => setShowProductModal(true)}
              >
                + Produk
              </button>
            </div>
          </div>

          {/* Tanggal */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Tanggal Mulai</label>
            <input
              type="date"
              className={styles.input}
              value={form.tanggal_mulai}
              onChange={(e) => setForm({ ...form, tanggal_mulai: e.target.value })}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Tanggal Berakhir</label>
            <input
              type="date"
              className={styles.input}
              value={form.tanggal_berakhir}
              onChange={(e) => setForm({ ...form, tanggal_berakhir: e.target.value })}
            />
          </div>

          <div className={styles.buttonGroupRight}>
            <button type="submit" className={styles.buttonPrimary} disabled={submitting}>
              {submitting ? "Menyimpan..." : "Simpan Promo"}
            </button>
          </div>

          {/* Tipe & Nilai */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Jenis</label>
            <select
              className={styles.select}
              value={form.tipe}
              onChange={(e) => setForm({ ...form, tipe: e.target.value })}
            >
              <option value="Persentase (%)">Persentase (%)</option>
              <option value="Nominal (Rp)">Nominal (Rp)</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Nilai</label>
            <input
              type="number"
              placeholder="Contoh: 10"
              className={styles.input}
              value={form.nilai}
              onChange={(e) => setForm({ ...form, nilai: e.target.value })}
            />
          </div>
        </form>

        {/* --- MODAL PILIH PRODUK --- */}
        {showProductModal && (
          <ModalPilihProduk
            alreadySelectedIds={form.produk_ids}
            onClose={() => setShowProductModal(false)}
            onSave={(selectedIds, selectedNames) => {
              setForm({
                ...form,
                produk_ids: selectedIds,
                produk_display: selectedNames.join(", ")
              });
              setShowProductModal(false);
            }}
          />
        )}

        {/* --- TABEL DAFTAR PROMO --- */}
        <div className={styles.tableSection}>
          <div className={styles.tableHeaderRow}>
            <h3 className={styles.tableTitle}>Daftar Promo</h3>
            <span className={styles.expiredNote}>
              Promo kadaluarsa otomatis bertanda <span className={styles.badgeExpiredSmall}>Expired</span>
            </span>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#666', padding: 20 }}>Memuat data...</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Tipe</th>
                  <th>Nilai</th>
                  <th>Produk</th>
                  <th>Periode</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {promos.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', padding: 20 }}>Belum ada promo</td></tr>
                ) : (
                  promos.map((promo) => {
                    const status = getStatus(promo.tanggal_mulai, promo.tanggal_selesai);



                    const produkText = promo.produk_display || (promo.produk_ids ? `${promo.produk_ids.length} Produk` : "-");

                    return (
                      <tr key={promo.id}>
                        <td>{promo.nama_promo}</td>
                        <td>{promo.jenis_promo === "Persentase (%)" ? "Persen" : "Nominal"}</td>
                        <td>
                          {promo.jenis_promo === "Persentase (%)"
                            ? `${promo.nilai}%`
                            : `Rp ${promo.nilai.toLocaleString('id-ID')}`
                          }
                        </td>

                        <td style={{ maxWidth: 250, whiteSpace: 'normal', fontSize: 13, lineHeight: 1.4 }}>
                          {produkText}
                        </td>

                        <td style={{ whiteSpace: 'nowrap', fontSize: 12 }}>
                          {promo.tanggal_mulai} <span style={{ color: '#999' }}>&gt;</span> {promo.tanggal_selesai}
                        </td>
                        <td>
                          <span className={status === 'Active' ? styles.badgeActive : styles.badgeExpired}>
                            {status}
                          </span>
                        </td>
                        <td>
                          <button className={styles.buttonDelete} onClick={() => handleDelete(promo.id)}>
                            Hapus
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}