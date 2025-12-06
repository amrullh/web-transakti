"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "../login/auth.css";
import { auth } from "@/lib/firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from "firebase/auth";


declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

const businessTypes = [
  "Fashion dan Gaya Hidup",
  "Makanan dan Minuman",
  "Kesehatan dan Kecantikan",
  "Teknologi dan Digital",
  "Properti dan Jasa"
];

export default function RegisterPage() {
  const router = useRouter();


  const [formData, setFormData] = useState({
    phone: "",
    storeName: "",
    businessType: "",
    password: ""
  });

  const [step, setStep] = useState<'FORM' | 'OTP'>('FORM');
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container-reg', {
        'size': 'invisible',
        'callback': () => {
        }
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setError("");
    if (!formData.phone || !formData.password || !formData.storeName || !formData.businessType) {
      return setError("Mohon lengkapi semua data!");
    }

    setLoading(true);
    const formattedPhone = formData.phone.replace(/^0/, '+62');

    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);

      setConfirmationResult(result);
      setStep('OTP');
      alert("Kode OTP terkirim! (Gunakan 123456 untuk tes)");
    } catch (err: any) {
      console.error(err);
      setError("Gagal mengirim OTP. Periksa koneksi atau nomor HP.");
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return setError("Masukkan kode OTP");

    setLoading(true);
    setError("");

    try {
      if (!confirmationResult) throw new Error("Sesi kadaluarsa, silakan ulangi.");

      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          phone: formData.phone,
          password: formData.password,
          storeName: formData.storeName,
          businessType: formData.businessType
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan data akun ke database.");
      }

      alert("Registrasi Berhasil! Silakan Login.");
      router.push("/auth/login");

    } catch (err: any) {
      console.error(err);
      setError("Kode OTP Salah atau terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        {/* BAGIAN KIRI (FORM) */}
        <div className="login-left">
          <Image
            src="/images/logo_di_auth.png"
            alt="logo"
            width={100}
            height={45}
            className="login-logo"
          />
          <h1 className="login-title">Registrasi</h1>
          <p className="login-subtitle">Daftar cepat, akses instan</p>

          {error && (
            <p style={{ color: 'red', marginBottom: '10px', fontSize: '14px', textAlign: 'center' }}>
              {error}
            </p>
          )}

          {step === 'FORM' ? (
            <>
              <div className="form-group">
                <label>No. Telepon</label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="Masukkan nomor telepon"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Nama Toko</label>
                <input
                  name="storeName"
                  type="text"
                  placeholder="Masukkan nama toko Anda"
                  value={formData.storeName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Jenis Bisnis</label>
                <div className="dropdown-wrapper">
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                  >
                    <option value="" disabled hidden>Pilih jenis bisnis Anda</option>
                    {businessTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="password-wrapper">
                  <input
                    name="password"
                    type="password"
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Container Recaptcha (Invisible) */}
              <div id="recaptcha-container-reg"></div>

              <button className="btn-login" onClick={handleRegister} disabled={loading}>
                {loading ? "Memproses..." : "Registrasi"}
              </button>
            </>
          ) : (
            <>
              <div className="form-group">
                <label style={{ textAlign: 'center', display: 'block' }}>Masukkan Kode OTP</label>
                <input
                  type="text"
                  placeholder="6 Digit Kode"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{ textAlign: 'center', letterSpacing: '4px', fontSize: '1.2rem' }}
                  maxLength={6}
                />
              </div>

              <button className="btn-login" onClick={handleVerifyOtp} disabled={loading}>
                {loading ? "Memverifikasi..." : "Verifikasi & Daftar"}
              </button>

              <p
                style={{ textAlign: 'center', marginTop: '10px', fontSize: '14px', color: '#666', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => { setStep('FORM'); setError(''); }}
              >
                Kembali / Ganti Nomor
              </p>
            </>
          )}

          <a href="/auth/login" className="register-link">
            Sudah punya akun?
          </a>
        </div>

        {/* BAGIAN KANAN (GAMBAR) */}
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