"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./auth.css";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!phone || !password) {
      setError("Nomor telepon dan password wajib diisi");
      return;
    }

    setLoading(true);

    const emailFormat = `${phone}@transakti.com`;

    try {

      const userCredential = await signInWithEmailAndPassword(auth, emailFormat, password);
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const userRole = userData.role;

        console.log("Login Sukses sebagai:", userRole);

        if (userRole === 'owner') {
          router.push("/dashboard/kelola-outlet");
        } else {

          router.push("/dashboard/pembayaran");
        }
      } else {
        setError("Data user tidak ditemukan di database.");
      }

    } catch (err: any) {
      console.error("Login Error:", err);

      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Nomor HP atau Password salah.");
      } else {
        setError("Gagal login: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        {/* KIRI - Form Login */}
        <div className="login-left">
          <Image
            src="/images/logo_di_auth.png"
            alt="logo"
            width={100}
            height={45}
            className="login-logo"
          />
          <h1 className="login-title">Login</h1>
          <p className="login-subtitle">Silahkan masuk untuk melanjutkan</p>

          {error && (
            <p style={{ color: "red", marginBottom: "16px", fontSize: "14px", textAlign: "center" }}>
              {error}
            </p>
          )}

          <div className="form-group">
            <label>No. Telepon*</label>
            <input
              type="tel"
              placeholder="Masukkan nomor telepon"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password*</label>
            <div className="password-wrapper">
              <input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button className="btn-login" onClick={handleLogin} disabled={loading}>
            {loading ? "Memuat..." : "Login"}
          </button>

          <a href="/auth/register" className="register-link">
            Belum punya akun? (khusus owner)
          </a>
        </div>

        {/* KANAN - Ilustrasi */}
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