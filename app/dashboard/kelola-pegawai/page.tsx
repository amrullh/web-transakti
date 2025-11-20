"use client";

import React, { useState } from "react";
import styles from "./kelolaPegawai.module.css";
import { FiSend } from "react-icons/fi";
import { useRouter } from "next/navigation";

interface Employee {
  id: number;
  nama: string;
  telepon: string;
  password: string;
  status: "Aktif" | "Nonaktif";
  alamat?: string;
  tanggalDiterima?: string;
}

export default function KelolaPegawai() {
  const router = useRouter();

  const [employees] = useState<Employee[]>([
    { 
      id: 1, 
      nama: "Susanti atiet bultang", 
      telepon: "08000849895", 
      password: "Kymsaubf", 
      status: "Aktif",
      alamat: "Jl. Bultang No. 21",
      tanggalDiterima: "2022-10-12"
    },
    { 
      id: 2, 
      nama: "Cici and yoyo", 
      telepon: "08944732984", 
      password: "djkabfuik", 
      status: "Aktif",
      alamat: "Jl. Mawar No. 14",
      tanggalDiterima: "2023-01-05"
    },
    { 
      id: 3, 
      nama: "Debora tiktokers", 
      telepon: "08372738495", 
      password: "FJAUlBkhf", 
      status: "Aktif",
      alamat: "Jl. TikTok Raya Blok A",
      tanggalDiterima: "2023-07-19"
    },
  ]);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const [detailPopup, setDetailPopup] = useState(false);
  const [detailEmployee, setDetailEmployee] = useState<Employee | null>(null);

  const openPopup = (emp: Employee) => {
    setSelectedEmployee(emp);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedEmployee(null);
  };

  const openDetailPopup = (emp: Employee) => {
    setDetailEmployee(emp);
    setDetailPopup(true);
  };

  const closeDetailPopup = () => {
    setDetailPopup(false);
    setDetailEmployee(null);
  };

  const sendWhatsApp = () => {
    if (!selectedEmployee) return;

    const phone = selectedEmployee.telepon.startsWith("0")
      ? "62" + selectedEmployee.telepon.substring(1)
      : selectedEmployee.telepon;

    const message = `
Halo ${selectedEmployee.nama},
Berikut adalah akun Anda:

Password: ${selectedEmployee.password}

Terima kasih.
    `;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const sendSMS = () => {
    if (!selectedEmployee) return;

    const phone = selectedEmployee.telepon;

    const message = `
Halo ${selectedEmployee.nama},
Akun Anda:

Password: ${selectedEmployee.password}

Terima kasih.
    `.trim();

    const url = `sms:${phone}?body=${encodeURIComponent(message)}`;

    window.location.href = url;
  };

  return (
    <div className={styles.pegawaiContainer}>
      <h1 className={styles.title}>Kelola Pegawai</h1>

      <div className={styles.tableWrapper}>
        <table className={styles.pegawaiTable}>
          <thead>
            <tr>
              <th>Nama</th>
              <th>No. Telepon</th>
              <th>Password</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr 
                key={emp.id} 
                className={styles.rowClickable} 
                onClick={() => openDetailPopup(emp)}
              >
                <td>{emp.nama}</td>
                <td>{emp.telepon}</td>
                <td>{emp.password}</td>
                <td><span className={styles.badge}>{emp.status}</span></td>
                <td>
                  <FiSend 
                    className={styles.sendIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      openPopup(emp);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Buttons kanan */}
      <div className={styles.actions}>
        <button 
          className={styles.editBtn}
          onClick={() => router.push("/pegawai/edit")}
        >
          Edit
        </button>

        <button 
          className={styles.addBtn}
          onClick={() => router.push("/pegawai/tambah")}
        >
          +
        </button>
      </div>

      {/* Popup WA/SMS */}
      {showPopup && (
        <div className={styles.overlay} onClick={closePopup}>
          <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupHeader}>
              <h3>Kirim Informasi ke Pegawai</h3>
              <button className={styles.closeBtn} onClick={closePopup}>×</button>
            </div>

            <div className={styles.popupBody}>
              <button className={styles.waBtn} onClick={sendWhatsApp}>
                <img src="/icons/whatsapp.png" className={styles.iconImg} /> Kirim via WhatsApp
              </button>

              <button className={styles.smsBtn} onClick={sendSMS}>
                <img src="/icons/sms.png" className={styles.iconImg} /> Kirim via SMS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP DETAIL PEGAWAI */}
      {detailPopup && detailEmployee && (
        <div className={styles.overlay} onClick={closeDetailPopup}>
          <div className={styles.detailPopup} onClick={(e) => e.stopPropagation()}>
            
            <div className={styles.detailHeader}>
              <h3>Detail Pegawai</h3>
              <button className={styles.closeBtn} onClick={closeDetailPopup}>×</button>
            </div>

            <div className={styles.detailBody}>
              <img 
                src="/foto-default.png" 
                alt="Foto Pegawai"
                className={styles.profileImg}
              />

              <p><strong>ID:</strong> {detailEmployee.id}</p>
              <p><strong>Nama:</strong> {detailEmployee.nama}</p>
              <p><strong>No Telepon:</strong> {detailEmployee.telepon}</p>
              <p><strong>Password:</strong> {detailEmployee.password}</p>
              <p><strong>Alamat:</strong> {detailEmployee.alamat}</p>
              <p><strong>Tanggal Diterima:</strong> {detailEmployee.tanggalDiterima}</p>
              <p><strong>Status Pegawai:</strong> {detailEmployee.status}</p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
