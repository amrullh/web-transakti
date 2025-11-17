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
}

export default function KelolaPegawai() {
  const router = useRouter();

  const [employees] = useState<Employee[]>([
    { id: 1, nama: "Susanti atiet bultang", telepon: "08000849895", password: "Kymsaubf", status: "Aktif" },
    { id: 2, nama: "Cici and yoyo", telepon: "08944732984", password: "djkabfuik", status: "Aktif" },
    { id: 3, nama: "Debora tiktokers", telepon: "08372738495", password: "FJAUlBkhf", status: "Aktif" },
  ]);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const openPopup = (emp: Employee) => {
    setSelectedEmployee(emp);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedEmployee(null);
  };

  // === ✔ Kirim WhatsApp ===
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

  // === ✔ Kirim SMS ===
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
              <tr key={emp.id}>
                <td>{emp.nama}</td>
                <td>{emp.telepon}</td>
                <td>{emp.password}</td>
                <td>
                  <span className={styles.badge}>{emp.status}</span>
                </td>
                <td>
                  <FiSend 
                    className={styles.sendIcon}
                    onClick={() => openPopup(emp)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tombol kanan */}
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

      {/* Popup */}
      {showPopup && (
        <div className={styles.overlay} onClick={closePopup}>
          <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
            
            <div className={styles.popupHeader}>
              <h3>Kirim Informasi ke Pegawai</h3>
              <button className={styles.closeBtn} onClick={closePopup}>×</button>
            </div>

            <div className={styles.popupBody}>
              
              {/* Tombol WhatsApp */}
              <button className={styles.waBtn} onClick={sendWhatsApp}>
                <img src="/icons/whatsapp.png" className={styles.iconImg} /> Kirim via WhatsApp
              </button>

              {/* Tombol SMS */}
              <button className={styles.smsBtn} onClick={sendSMS}>
                <img src="/icons/sms.png" className={styles.iconImg} /> Kirim via SMS
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
