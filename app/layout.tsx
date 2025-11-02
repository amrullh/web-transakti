
import React from 'react';
import type { Metadata } from 'next';
import Sidebar from '../components/Sidebar';


const colors = {
  darkBlue: '#205781',
  teal: '#4F959D',
  mintGreen: '#98D2C0',
  lightCream: '#F6F8D5',
  white: '#FFFFFF',
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

  const userRole = 'owner';

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: 'Roboto, sans-serif',
          display: 'flex',
          backgroundColor: colors.white,
          minHeight: '100vh',
          overflowX: 'hidden',
        }}
      >
        <Sidebar role={userRole} />

        {/* Area Konten Utama */}
        <main
          style={{
            flex: 1,
            backgroundColor: colors.white,
            color: colors.darkBlue,
            minHeight: '100vh',
            padding: '2rem 3rem',
            boxSizing: 'border-box',
          }}
        >
          {children} {/* Halaman Anda akan muncul di sini */}
        </main>
      </body>
    </html>
  );
}