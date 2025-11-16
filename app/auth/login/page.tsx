"use client";

import Image from "next/image";
import "./auth.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // dummy user
  const dummyUser = {
    phone: "08123456789",
    password: "admin123",
  };

  const handleLogin = () => {
    setError("");

    // 1. Validate empty fields
    if (!phone || !password) {
      setError("Semua field wajib diisi");
      return;
    }

    // 2. Validate incorrect credentials
    if (phone !== dummyUser.phone || password !== dummyUser.password) {
      setError("Nomor telepon atau password salah");
      return;
    }

    // 3. Save login status
    localStorage.setItem("isLoggedIn", "true");

    // 4. Redirect to dashboard
    router.push("/dashboard/kelola-outlet"); 
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">

        {/* LEFT */}
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
            <p style={{ color: "red", marginBottom: "16px", fontSize: "14px" }}>
              {error}
            </p>
          )}

          <div className="form-group">
            <label>No. Telepon*</label>
            <input
              type="text"
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
            <a className="forgot">Lupa password?</a>
          </div>

          <button className="btn-login" onClick={handleLogin}>
            Login
          </button>

          <a href="/auth/register" className="register-link">
            Belum punya akun? (khusus owner)
          </a>
        </div>

        {/* RIGHT */}
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
