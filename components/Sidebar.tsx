
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import React from 'react';

const colors = {
  darkBlue: '#205781',
  teal: '#4F959D',
  mintGreen: '#98D2C0',
  lightCream: '#F6F8D5',
  white: '#FFFFFF',
};

type SidebarProps = {
  role: 'owner' | 'pegawai';
};


const ownerLinks = [
  { name: 'Kelola Outlet', href: '/dashboard/kelola-outlet' },
  { name: 'Kelola Produk', href: '/dashboard/kelola-produk' },
  { name: 'Kelola Pegawai', href: '/dashboard/kelola-pegawai' },
  { name: 'Pembayaran', href: '/dashboard/pembayaran' },
  { name: 'Promo', href: '/dashboard/promo' },
  { name: 'Riwayat Transaksi', href: '/dashboard/riwayat-transaksi' },
  { name: 'Pengaturan Struk', href: '/dashboard/pengaturan-struk' },
  { name: 'Laporan Penjualan', href: '/dashboard/laporan-penjualan' },
];

const pegawaiLinks = [
  { name: 'Transaksi', href: '/dashboard-pegawai/transaksi' },
  { name: 'Pembayaran', href: '/dashboard-pegawai/pembayaran' },
  { name: 'Riwayat Transaksi', href: '/dashboard-pegawai/riwayat-transaksi' },
];


export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const links = role === 'owner' ? ownerLinks : pegawaiLinks;

  const sidebarStyle: React.CSSProperties = {
    width: '280px',
    height: '100vh',
    backgroundColor: colors.darkBlue,
    color: colors.white,
    padding: '2rem 1.5rem',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    borderRadius: '0 30px 30px 0',
    boxShadow: '4px 0 10px rgba(0,0,0,0.1)',
  };

  const logoContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '3rem',
  };

  const navStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    flexGrow: 1,
  };

  const linkStyle: React.CSSProperties = {
    textDecoration: 'none',
    color: colors.white,
    padding: '0.8rem 1rem',
    borderRadius: '8px',
    transition: 'background-color 0.2s, color 0.2s',
    fontSize: '0.95rem',
    display: 'flex',
    alignItems: 'center',
  };

  const activeLinkStyle: React.CSSProperties = {
    ...linkStyle,
    backgroundColor: colors.lightCream,
    color: colors.darkBlue,
    fontWeight: 'bold',
  };

  const logoutLinkStyle: React.CSSProperties = {
    ...linkStyle,
    backgroundColor: 'transparent',
    border: `1px solid ${colors.teal}`,
    marginTop: 'auto',
    color: colors.white,
    textAlign: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={sidebarStyle}>
      <div style={logoContainerStyle}>
        <Image
          src="/images/transakti-logo.png"
          alt="Transakti Logo"
          width={120}
          height={100}
          priority
        />
      </div>

      <nav style={navStyle}>
        {links.map((link) => {

          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.name}
              href={link.href}
              style={isActive ? activeLinkStyle : linkStyle}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      <Link href="/logout" style={logoutLinkStyle}>
        Keluar
      </Link>
    </div>
  );
}