
import React from 'react';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Transakti POS',
    description: 'Aplikasi Point of Sale berbasis Next.js',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body style={{
                margin: 0,
                padding: 0,
                fontFamily: 'Roboto, sans-serif',
                backgroundColor: '#FFFFFF',
                minHeight: '100vh'
            }}>
                {children}
            </body>
        </html>
    );
}