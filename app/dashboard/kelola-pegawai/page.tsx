"use client";

import React, { useState } from "react";
import styles from "./kelolaPegawai.module.css";
import { FiSend, FiEdit, FiTrash2 } from "react-icons/fi";

interface Employee {
  id: number;
  nama: string;
  telepon: string;
  password: string;
  status: "Aktif" | "Nonaktif";
  alamat?: string;
  tanggalDiterima?: string;
  foto?: string;
}

// ========================
// GENERATE PASSWORD OTOMATIS
// ========================
const generatePassword = (length = 8) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let pass = "";
  for (let i = 0; i < length; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
};

export default function KelolaPegawai() {
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      nama: "Susanti atiet bultang",
      telepon: "08000849895",
      password: "Kymsaubf",
      status: "Aktif",
      alamat: "Jl. Bultang No. 21",
      tanggalDiterima: "2022-10-12",
      foto: "/foto-default.png",
    },
    {
      id: 2,
      nama: "Cici and yoyo",
      telepon: "08944732984",
      password: "djkabfuik",
      status: "Aktif",
      alamat: "Jl. Mawar No. 14",
      tanggalDiterima: "2023-01-05",
      foto: "/foto-default.png",
    },
    {
      id: 3,
      nama: "Debora tiktokers",
      telepon: "08372738495",
      password: "FJAUlBkhf",
      status: "Aktif",
      alamat: "Jl. TikTok Raya Blok A",
      tanggalDiterima: "2023-07-19",
      foto: "/foto-default.png",
    },
  ]);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<Employee | null>(null);

  const [detailPopup, setDetailPopup] = useState(false);
  const [detailEmployee, setDetailEmployee] = useState<Employee | null>(null);

  const [editPopup, setEditPopup] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [addPopup, setAddPopup] = useState(false);

  const [editData, setEditData] = useState<Employee | null>(null);
  const [search, setSearch] = useState("");

  // ========================
  // ADD DATA DENGAN PASSWORD OTOMATIS
  // ========================
  const [addData, setAddData] = useState<Employee>({
    id: 0,
    nama: "",
    telepon: "",
    password: generatePassword(), // otomatis
    status: "Aktif",
    alamat: "",
    tanggalDiterima: "",
    foto: "/foto-default.png",
  });

  const openDetailPopup = (emp: Employee) => {
    setDetailEmployee(emp);
    setDetailPopup(true);
  };

  const closeDetailPopup = () => {
    setDetailPopup(false);
    setDetailEmployee(null);
  };

  const openPopup = (emp: Employee) => {
    setSelectedEmployee(emp);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedEmployee(null);
  };

  const openEditPopup = (emp: Employee) => {
    setEditData({ ...emp });
    setEditPopup(true);
  };

  const closeEditPopup = () => {
    setEditPopup(false);
    setEditData(null);
  };

  const saveEdit = () => {
    if (!editData) return;

    setEmployees((prev) =>
      prev.map((e) => (e.id === editData.id ? editData : e))
    );
    closeEditPopup();
  };

  const openDeletePopup = (emp: Employee) => {
    setSelectedEmployee(emp);
    setDeletePopup(true);
  };

  const closeDeletePopup = () => {
    setDeletePopup(false);
    setSelectedEmployee(null);
  };

  const confirmDelete = () => {
    if (!selectedEmployee) return;

    setEmployees((prev) => prev.filter((e) => e.id !== selectedEmployee.id));
    closeDeletePopup();
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

    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const sendSMS = () => {
    if (!selectedEmployee) return;

    window.location.href = `sms:${selectedEmployee.telepon}?body=${encodeURIComponent(
      `Halo ${selectedEmployee.nama}, Password Anda: ${selectedEmployee.password}`
    )}`;
  };

  // ========================
  // SAVE ADD -> PASSWORD TETAP OTOMATIS KALAU TIDAK DIUBAH
  // ========================
  const saveAdd = () => {
    const newEmployee = {
      ...addData,
      id: employees.length + 1,
    };

    setEmployees([...employees, newEmployee]);

    // reset & generate password baru otomatis
    setAddData({
      id: 0,
      nama: "",
      telepon: "",
      password: generatePassword(),
      status: "Aktif",
      alamat: "",
      tanggalDiterima: "",
      foto: "/foto-default.png",
    });

    setAddPopup(false);
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.nama.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.pegawaiContainer}>
      <h1 className={styles.title}>Kelola Pegawai</h1>

      <input
        type="text"
        placeholder="Cari pegawai..."
        className={styles.searchInput}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

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
            {filteredEmployees.map((emp) => (
              <tr
                key={emp.id}
                className={styles.rowClickable}
                onClick={() => openDetailPopup(emp)}
              >
                <td>{emp.nama}</td>
                <td>{emp.telepon}</td>
                <td>{emp.password}</td>
                <td>
                  <span
                    className={
                      emp.status === "Aktif"
                        ? styles.badgeAktif
                        : styles.badgeNon
                    }
                  >
                    {emp.status}
                  </span>
                </td>

                <td className={styles.actionCell}>
                  <FiSend
                    className={styles.sendIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      openPopup(emp);
                    }}
                  />

                  <FiEdit
                    className={styles.editIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditPopup(emp);
                    }}
                  />

                  <FiTrash2
                    className={styles.deleteIcon}
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeletePopup(emp);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ====================== ADD BUTTON ====================== */}
      <div className={styles.actions}>
        <button className={styles.addBtn} onClick={() => setAddPopup(true)}>
          +
        </button>
      </div>

      {/* ====================== POPUP TAMBAH ====================== */}
      {addPopup && (
        <div className={styles.bigOverlay} onClick={() => setAddPopup(false)}>
          <div
            className={styles.bigEditPopup}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.bigCloseBtn}
              onClick={() => setAddPopup(false)}
            >
              ×
            </button>

            <h2 className={styles.bigEditTitle}>Tambah Pegawai</h2>

            <div className={styles.bigPhotoContainer}>
              <img
                src={addData.foto}
                className={styles.bigProfilePhoto}
                alt="Foto Pegawai"
              />

              <label className={styles.bigUploadBtn}>
                <span className={styles.cameraIcon}>📷</span>
                <input
                  type="file"
                  accept="image/*"
                  className={styles.hiddenInput}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () =>
                      setAddData({
                        ...addData,
                        foto: reader.result as string,
                      });
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            </div>

            <div className={styles.bigForm}>
              <label>Nama Lengkap</label>
              <input
                type="text"
                value={addData.nama}
                onChange={(e) =>
                  setAddData({ ...addData, nama: e.target.value })
                }
              />

              <label>No. Telepon</label>
              <input
                type="text"
                value={addData.telepon}
                onChange={(e) =>
                  setAddData({ ...addData, telepon: e.target.value })
                }
              />

              <label>Password (otomatis, boleh diganti)</label>
              <input
                type="text"
                value={addData.password}
                onChange={(e) =>
                  setAddData({ ...addData, password: e.target.value })
                }
              />

              <label>Alamat</label>
              <textarea
                rows={3}
                value={addData.alamat}
                onChange={(e) =>
                  setAddData({ ...addData, alamat: e.target.value })
                }
              />

              <label>Tanggal Diterima</label>
              <input
                type="date"
                value={addData.tanggalDiterima}
                onChange={(e) =>
                  setAddData({
                    ...addData,
                    tanggalDiterima: e.target.value,
                  })
                }
              />
            </div>

            <button className={styles.bigSaveBtn} onClick={saveAdd}>
              Simpan
            </button>
          </div>
        </div>
      )}

      {/* ====================== POPUP WA / SMS ====================== */}
      {showPopup && (
        <div className={styles.overlay} onClick={closePopup}>
          <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
            <div className={styles.popupHeader}>
              <h3>Kirim Informasi ke Pegawai</h3>
              <button className={styles.closeBtn} onClick={closePopup}>
                ×
              </button>
            </div>

            <div className={styles.popupBody}>
              <button className={styles.waBtn} onClick={sendWhatsApp}>
                <img src="/icons/whatsapp.png" className={styles.iconImg} />{" "}
                Kirim via WhatsApp
              </button>

              <button className={styles.smsBtn} onClick={sendSMS}>
                <img src="/icons/sms.png" className={styles.iconImg} /> Kirim via
                SMS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====================== POPUP DETAIL ====================== */}
      {detailPopup && detailEmployee && (
        <div className={styles.overlay} onClick={closeDetailPopup}>
          <div
            className={styles.detailPopup}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.detailHeader}>
              <h3>Detail Pegawai</h3>
              <button className={styles.closeBtn} onClick={closeDetailPopup}>
                ×
              </button>
            </div>

            <div className={styles.detailBody}>
              <img
                src={detailEmployee.foto || "/foto-default.png"}
                alt="Foto Pegawai"
                className={styles.profileImg}
              />

              <p>
                <strong>ID:</strong> {detailEmployee.id}
              </p>
              <p>
                <strong>Nama:</strong> {detailEmployee.nama}
              </p>
              <p>
                <strong>No Telepon:</strong> {detailEmployee.telepon}
              </p>
              <p>
                <strong>Password:</strong> {detailEmployee.password}
              </p>
              <p>
                <strong>Alamat:</strong> {detailEmployee.alamat}
              </p>
              <p>
                <strong>Tanggal Diterima:</strong> {detailEmployee.tanggalDiterima}
              </p>
              <p>
                <strong>Status Pegawai:</strong> {detailEmployee.status}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ====================== POPUP EDIT ====================== */}
      {editPopup && editData && (
        <div className={styles.bigOverlay} onClick={closeEditPopup}>
          <div
            className={styles.bigEditPopup}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.bigCloseBtn} onClick={closeEditPopup}>
              ×
            </button>

            <h2 className={styles.bigEditTitle}>Edit Data Pegawai</h2>

            <div className={styles.bigPhotoContainer}>
              <img
                src={editData.foto || "/foto-default.png"}
                className={styles.bigProfilePhoto}
                alt="Foto Pegawai"
              />

              <label className={styles.bigUploadBtn}>
                <span className={styles.cameraIcon}>📷</span>
                <input
                  type="file"
                  accept="image/*"
                  className={styles.hiddenInput}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () =>
                      setEditData({
                        ...editData,
                        foto: reader.result as string,
                      });
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            </div>

            <div className={styles.bigForm}>
              <label>Nama Lengkap</label>
              <input
                type="text"
                value={editData.nama}
                onChange={(e) =>
                  setEditData({ ...editData, nama: e.target.value })
                }
              />

              <label>No. Telp</label>
              <input
                type="text"
                value={editData.telepon}
                onChange={(e) =>
                  setEditData({ ...editData, telepon: e.target.value })
                }
              />

              <label>Password</label>
              <input
                type="text"
                value={editData.password}
                onChange={(e) =>
                  setEditData({ ...editData, password: e.target.value })
                }
              />

              <label>Alamat</label>
              <textarea
                rows={3}
                value={editData.alamat || ""}
                onChange={(e) =>
                  setEditData({ ...editData, alamat: e.target.value })
                }
              ></textarea>

              <label>Status</label>
              <div className={styles.statusGroup}>
                <button
                  type="button"
                  className={`${styles.statusBtn} ${
                    editData.status === "Aktif" ? styles.statusActive : ""
                  }`}
                  onClick={() =>
                    setEditData({ ...editData, status: "Aktif" })
                  }
                >
                  Aktif
                </button>

                <button
                  type="button"
                  className={`${styles.statusBtn} ${
                    editData.status === "Nonaktif" ? styles.statusNon : ""
                  }`}
                  onClick={() =>
                    setEditData({ ...editData, status: "Nonaktif" })
                  }
                >
                  Nonaktif
                </button>
              </div>
            </div>

            <button className={styles.bigSaveBtn} onClick={saveEdit}>
              Simpan
            </button>
          </div>
        </div>
      )}

      {/* ====================== POPUP DELETE ====================== */}
      {deletePopup && (
        <div className={styles.smallOverlay} onClick={closeDeletePopup}>
          <div
            className={styles.smallDeletePopup}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.smallCloseBtn} onClick={closeDeletePopup}>
              ×
            </button>

            <p className={styles.smallDeleteText}>
              Apakah anda yakin ingin menghapus<br />data pegawai?
            </p>

            <button className={styles.smallYesBtn} onClick={confirmDelete}>
              Hapus
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
