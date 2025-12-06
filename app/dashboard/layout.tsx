import React from 'react';
import Sidebar from 'components/Sidebar';
const colors = {
  darkBlue: '#205781',
  white: '#FFFFFF',
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: colors.white,
        fontFamily: 'Roboto, sans-serif',
      }}
    >

      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 10
      }}>
        <Sidebar /> {/* Sidebar dipanggil di sini */}
      </div>

      <main
        style={{
          flex: 1,
          backgroundColor: colors.white,
          color: '#205781',
          minHeight: '100vh',
          padding: '2rem 3rem',
          boxSizing: 'border-box',
          marginLeft: '280px',
          overflowY: 'auto',
        }}
      >
        {children}
      </main>
    </div>
  );
}