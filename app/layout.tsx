// app/layout.tsx
import React from 'react';
import type { Metadata } from 'next';
import Sidebar from '../components/Sidebar';

// Palet warna dari Anda (redefinisi untuk kemudahan)
const colors = {
  darkBlue: '#205781',
  teal: '#4F959D',
  mintGreen: '#98D2C0',
  lightCream: '#F6F8D5', // Ini akan jadi background konten utama (mendekati putih)
  white: '#FFFFFF', // Kita tambahkan putih murni untuk background page
};

export const metadata: Metadata = {
  title: 'Transakti POS',
  description: 'Aplikasi Point of Sale berbasis Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // --- PENTING! ---
  // Untuk kerangka ini, kita hardcode 'role' nya.
  // Di aplikasi nyata, 'role' ini akan Anda dapatkan dari data sesi (session)
  // setelah pengguna login.

  const userRole = 'owner';
  // const userRole = 'pegawai'; // Coba ganti untuk melihat menu berbeda

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: 'Roboto, sans-serif', // Menggunakan font yang umum seperti di Figma (asumsi Roboto)
          display: 'flex',
          backgroundColor: colors.white, // Background body utama adalah putih
          minHeight: '100vh',
          overflowX: 'hidden', // Mencegah scroll horizontal yang tidak diinginkan
        }}
      >
        <Sidebar role={userRole} />

        {/* Area Konten Utama */}
        <main
          style={{
            flex: 1, // Mengisi sisa ruang
            backgroundColor: colors.white, // Background konten utama adalah putih
            color: colors.darkBlue, // Warna teks default
            minHeight: '100vh',
            padding: '2rem 3rem', // Padding konten, sedikit lebih besar
            boxSizing: 'border-box',
          }}
        >
          {children} {/* Halaman Anda akan muncul di sini */}
        </main>
      </body>
    </html>
  );
}