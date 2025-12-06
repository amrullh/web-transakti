// app/dashboard-pegawai/pembayaran/components/ReceiptModal.tsx
"use client";
import React from 'react';

// Tipe data yang dibutuhkan untuk ditampilkan
interface TransactionData {
    items: Array<{
        nama: string;
        harga_jual: number;
        diskonPerItem: number;
        qty: number;
    }>;
    subtotal: number;
    diskon: number;
    pajak: number;
    total: number;
    customerName: string;
    paymentMethod: string;
    pegawaiInfo: { nama: string };
    tanggal: string;
}

interface ReceiptSettings {
    headerText: string;
    footerText: string;
    outletName: string;
    isDiscountEnabled: boolean;
}

interface Props {
    transaction: TransactionData;
    settings: ReceiptSettings;
    onClose: () => void;
}

export default function ReceiptModal({ transaction, settings, onClose }: Props) {
    const transactionDate = new Date(transaction.tanggal).toLocaleDateString('id-ID', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
    const transactionTime = new Date(transaction.tanggal).toLocaleTimeString('id-ID', {
        hour: '2-digit', minute: '2-digit'
    });

    const formatRupiah = (num: number) => {
        return num.toLocaleString('id-ID');
    }

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }}>
            <div style={{
                background: 'white', borderRadius: 16, padding: 24, width: 380,
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)', position: 'relative'
            }}>
                <div style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: 14 }}>
                    {/* Header Struk */}
                    <h2 style={{ fontSize: 20, fontWeight: 'bold', margin: '0 0 4px 0' }}>{settings.outletName}</h2>
                    <p style={{ margin: '0 0 10px 0', fontSize: 12, color: '#666' }}>{settings.headerText}</p>
                    <div style={{ borderBottom: '1px dashed #ccc', margin: '10px 0' }} />

                    {/* Info Transaksi */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
                        <span>Tanggal:</span>
                        <span>{transactionDate} ({transactionTime})</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
                        <span>Kasir:</span>
                        <span>{transaction.pegawaiInfo.nama}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
                        <span>Pelanggan:</span>
                        <span>{transaction.customerName || 'Umum'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0' }}>
                        <span>Metode:</span>
                        <span>{transaction.paymentMethod}</span>
                    </div>
                    <div style={{ borderBottom: '1px dashed #ccc', margin: '10px 0' }} />

                    {/* Item List */}
                    <p style={{ fontWeight: 'bold', textAlign: 'left', margin: '10px 0 5px 0' }}>ITEM BELANJA:</p>
                    {transaction.items.map((item, index) => (
                        <div key={index} style={{ textAlign: 'left', marginBottom: 8, borderBottom: '1px dotted #eee', paddingBottom: 5 }}>
                            <div style={{ fontWeight: 'bold' }}>{item.nama}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#444' }}>
                                <span>{item.qty} x Rp {formatRupiah(item.harga_jual)}</span>
                                <span>Rp {formatRupiah(item.qty * item.harga_jual)}</span>
                            </div>
                            {settings.isDiscountEnabled && item.diskonPerItem > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'red', marginTop: 2 }}>
                                    <span>Diskon per item</span>
                                    <span>- Rp {formatRupiah(item.qty * item.diskonPerItem)}</span>
                                </div>
                            )}
                        </div>
                    ))}

                    <div style={{ borderBottom: '1px dashed #ccc', margin: '10px 0' }} />

                    {/* Summary */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0', fontSize: 14 }}>
                        <span>Subtotal</span>
                        <span>Rp {formatRupiah(transaction.subtotal)}</span>
                    </div>

                    {settings.isDiscountEnabled && transaction.diskon > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0', fontSize: 14, color: 'red' }}>
                            <span>Total Diskon</span>
                            <span>- Rp {formatRupiah(transaction.diskon)}</span>
                        </div>
                    )}
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '4px 0', fontSize: 14 }}>
                        <span>Pajak (10%)</span>
                        <span>Rp {formatRupiah(transaction.pajak)}</span>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '10px 0', paddingTop: 10, borderTop: '2px solid #333', fontWeight: 'bold', fontSize: 18 }}>
                        <span>TOTAL</span>
                        <span>Rp {formatRupiah(transaction.total)}</span>
                    </div>

                    {/* Footer Struk */}
                    <div style={{ borderBottom: '1px dashed #ccc', margin: '10px 0' }} />
                    <p style={{ margin: '0 0 10px 0', fontSize: 12, color: '#666' }}>{settings.footerText}</p>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '10px 20px', background: '#216b9b', color: 'white',
                            border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold'
                        }}
                    >
                        Selesai & Transaksi Baru
                    </button>
                </div>
            </div>
        </div>
    );
}