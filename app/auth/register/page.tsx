"use client";

import Image from "next/image";
import "../login/auth.css";

// Data untuk opsi dropdown "Jenis Bisnis"
const businessTypes = [
  "Fashion dan Gaya Hidup",
  "Makanan dan Minuman",
  "Kesehatan dan Kecantikan",
  "Teknologi dan Digital",
  "Properti dan Jasa",
];

export default function register() {
  return (
    <div className="login-wrapper">
      <div className="login-card">
        {/* LEFT - Formulir Registrasi */}
        <div className="login-left">
          {/* Logo (asumsi path dan ukuran sama dengan halaman login) */}
          <Image
            src="/images/logo_di_auth.png"
            alt="logo"
            width={100}
            height={45} 
            className="login-logo"
          />

          <h1 className="login-title">Registrasi</h1>
          <p className="login-subtitle">Daftar cepat, akses instan</p>

          {/* Input No. Telepon */}
          <div className="form-group">
            <label>No. Telepon</label>
            <input type="text" placeholder="Masukkan nomor telepon" />
          </div>

          {/* Input Nama Toko */}
          <div className="form-group">
            <label>Nama Toko</label>
            <input type="text" placeholder="Masukkan nama toko Anda" />
          </div>

          {/* Dropdown Jenis Bisnis */}
          <div className="form-group">
            <label>Jenis Bisnis</label>
            <div className="dropdown-wrapper">
              <select defaultValue="">
                <option value="" disabled hidden>
                  Pilih jenis bisnis Anda
                </option>
                {businessTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Input Password */}
          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input type="password" placeholder="Masukkan password" />
              {/* Tempat untuk ikon mata (toggle password visibility) */}
            </div>
            {/* Link lupa password dihilangkan di halaman registrasi */}
          </div>

          {/* Tombol Registrasi */}
          <button className="btn-login">Registrasi</button>

          {/* Link Sudah Punya Akun */}
          <a href="/auth/login" className="register-link">
            Sudah punya akun?
          </a>
        </div>

        {/* RIGHT - Ilustrasi (sama dengan halaman login) */}
        <div className="login-right">
          <Image
            src="/images/ilus_auth.png"
            width={300}
            height={250}
            alt="illustration"
          />
        </div>
      </div>
    </div>
  );
}