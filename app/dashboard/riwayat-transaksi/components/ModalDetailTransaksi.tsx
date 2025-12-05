"use client";
// app/dashboard/riwayat-transaksi/components/ModalDetailTransaksi.tsx
import { useState } from "react";
import modal from "../../kelola-produk/Modal.module.css";
import { TransaksiType } from "../page";
export default function ModalDetailTransaksi({
  data,
  onClose
}: {
  data: TransaksiType;
  onClose: () => void;
}) {
  return (
    <div className={modal.overlay}>
      <div className={modal.modalLarge} style={{ position: "relative" }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: 16,
            top: 16,
            background: "transparent",
            border: "none",
            fontSize: 18,
            cursor: "pointer",
            color: "#555"
          }}
        >
          ✕
        </button>

        {/* Title */}
        <h3 className={modal.modalTitle} style={{ textAlign: "center", marginBottom: 20 }}>
          DETAIL TRANSAKSI
        </h3>

        {/* Basic info */}
        <div style={{ display: "flex", gap: 20, marginTop: 12, fontSize: "14px", color: "#333" }}>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 4 }}>
              <strong>ID Transaksi:</strong> <span style={{ fontFamily: "monospace" }}>{data.id_transaksi_readable || data.id}</span>
            </div>
            <div style={{ marginBottom: 4 }}><strong>Tanggal:</strong> {data.tanggal}</div>
            <div style={{ marginBottom: 4 }}><strong>Kasir:</strong> {data.kasir}</div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 4 }}><strong>Pelanggan:</strong> {data.nama_pelanggan}</div>
            <div style={{ marginBottom: 4 }}><strong>Metode:</strong> {data.metode}</div>
            <div style={{ marginBottom: 4 }}><strong>Waktu:</strong> {data.waktu}</div>
          </div>
        </div>

        {/* Table scrollable */}
        <div style={{
          maxHeight: "50vh",
          overflowY: "auto",
          marginTop: 16,
          borderRadius: 6,
          border: "1px solid #e5e7eb"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead style={{ background: "#f1f6f8", position: "sticky", top: 0 }}>
              <tr>
                <th style={{ padding: "10px 8px", textAlign: "left", color: "#1f4f6f" }}>No</th>
                <th style={{ padding: "10px 8px", textAlign: "left", color: "#1f4f6f" }}>Nama Produk</th>
                <th style={{ padding: "10px 8px", textAlign: "right", color: "#1f4f6f" }}>Jumlah</th>
                <th style={{ padding: "10px 8px", textAlign: "right", color: "#1f4f6f" }}>Harga</th>
                <th style={{ padding: "10px 8px", textAlign: "right", color: "#1f4f6f" }}>Diskon</th>
                <th style={{ padding: "10px 8px", textAlign: "right", color: "#1f4f6f" }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {data.items && data.items.length > 0 ? (
                data.items.map((item, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f0f0f0" }}>
                    <td style={{ padding: 8 }}>{i + 1}</td>
                    <td style={{ padding: 8 }}>{item.nama_produk || (item as any).nama}</td>
                    <td style={{ padding: 8, textAlign: "right" }}>{item.jumlah}</td>
                    <td style={{ padding: 8, textAlign: "right" }}>
                      Rp {(item.harga_satuan || (item as any).harga || 0).toLocaleString("id-ID")}
                    </td>
                    <td style={{ padding: 8, textAlign: "right", color: item.diskon_per_item ? "red" : "inherit" }}>
                      {item.diskon_per_item ? `- Rp ${(item.diskon_per_item * item.jumlah).toLocaleString("id-ID")}` : "-"}
                    </td>
                    <td style={{ padding: 8, textAlign: "right", fontWeight: 500 }}>
                      Rp {item.subtotal.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: 20, textAlign: "center", color: "#888" }}>
                    Detail item tidak tersedia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 280, fontSize: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "#555" }}>Subtotal</span>
              <span style={{ fontWeight: 500 }}>
                Rp {(data.subtotal_murni ?? (data.total + data.diskon - data.pajak)).toLocaleString("id-ID")}
              </span>
            </div>

            {data.diskon > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, color: "#d32f2f" }}>
                <span>Diskon Total</span>
                <span>- Rp {data.diskon.toLocaleString("id-ID")}</span>
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "#555" }}>Pajak (10%)</span>
              <span>Rp {data.pajak.toLocaleString("id-ID")}</span>
            </div>

            <div style={{
              marginTop: 10,
              paddingTop: 10,
              borderTop: "2px solid #e5e7eb",
              fontWeight: "bold",
              fontSize: "16px",
              display: "flex",
              justifyContent: "space-between",
              color: "#205781"
            }}>
              <span>Total Bayar</span>
              <span>Rp {data.total.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}