// app/dashboard/promo/page.tsx
import React from 'react';
import styles from './Promo.module.css';

//data dummy
const dummyPromos = [
  {
    id: 1,
    nama: 'Summer Sale',
    tipe: 'Persen',
    nilai: '10 %',
    produk: 'Nasi Goreng, Es Teh',
    periode: '2025-09-13 > 2025-09-20',
    status: 'Active',
  },
  {
    id: 2,
    nama: 'Jumat Berkah',
    tipe: 'Nominal',
    nilai: 'Rp 5.000',
    produk: 'Ayam Geprek',
    periode: '2025-08-01 > 2025-08-01',
    status: 'Expired',
  },
];

export default function PromoPage() {
  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.header}>Promosi & Diskon</h1>
      <div className={styles.cardContainer}>
        
        <p className={styles.instruction}>
          Tambahkan promo baru dengan mengisi form singkat di bawah ini.
        </p>

        <form className={styles.formGrid}>
          {/* Baris 1 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Nama Promo</label>
            <input type="text" placeholder="Diskon Weekend" className={styles.input} />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Produk yang Didiskon</label>
            <div className={styles.inputWithButton}>
              <input type="text" placeholder="Contoh: Nasi Goreng" className={styles.input} />
              <button type="button" className={styles.buttonSecondary}>+ Produk</button>
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Tanggal Mulai</label>
            <input type="date" className={styles.input} />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Tanggal Berakhir</label>
            <input type="date" className={styles.input} />
          </div>

          <div className={styles.buttonGroupRight}>
             <button type="submit" className={styles.buttonPrimary}>Simpan Promo</button>
          </div>

          {/* Baris 2 */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Jenis</label>
            <select className={styles.select}>
              <option>Persentase (%)</option>
              <option>Nominal (Rp)</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Nilai</label>
            <input type="number" placeholder="10" className={styles.input} />
          </div>
        </form>

        {/* --- BAGIAN TABEL --- */}
        <div className={styles.tableSection}>
          <div className={styles.tableHeaderRow}>
            <h3 className={styles.tableTitle}>Daftar Promo</h3>
            <span className={styles.expiredNote}>
              Promo yang kadaluarsa akan otomatis bertanda <span className={styles.badgeExpiredSmall}>Expired</span>
            </span>
          </div>

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
              {dummyPromos.map((promo) => (
                <tr key={promo.id}>
                  <td>{promo.nama}</td>
                  <td>{promo.tipe}</td>
                  <td>{promo.nilai}</td>
                  <td>{promo.produk}</td>
                  <td style={{whiteSpace: 'nowrap'}}>{promo.periode}</td>
                  <td>
                    <span
                      className={
                        promo.status === 'Active'
                          ? styles.badgeActive
                          : styles.badgeExpired
                      }
                    >
                      {promo.status}
                    </span>
                  </td>
                  <td>
                    <button className={styles.buttonDelete}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}