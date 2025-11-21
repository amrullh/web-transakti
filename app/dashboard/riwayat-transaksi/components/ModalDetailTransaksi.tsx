"use client";

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
            cursor: "pointer"
          }}
        >
          ✕
        </button>

        {/* Title */}
        <h3 className={modal.modalTitle} style={{ textAlign: "center" }}>
          DETAIL TRANSAKSI
        </h3>

        {/* Basic info */}
        <div style={{ display: "flex", gap: 20, marginTop: 12 }}>
          <div style={{ flex: 1 }}>
            <div><strong>ID Transaksi:</strong> {data.id}</div>
            <div><strong>Tanggal:</strong> {data.tanggal}</div>
            <div><strong>Kasir:</strong> {data.kasir}</div>
          </div>

          <div style={{ flex: 1 }}>
            <div><strong>Metode:</strong> {data.metode}</div>
            <div><strong>Waktu:</strong> {data.waktu}</div>
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
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ background: "#f1f6f8" }}>
              <tr>
                <th style={{ padding: 8 }}>No</th>
                <th style={{ padding: 8 }}>ID Produk</th>
                <th style={{ padding: 8 }}>Nama Produk</th>
                <th style={{ padding: 8, textAlign: "right" }}>Jumlah</th>
                <th style={{ padding: 8, textAlign: "right" }}>Harga</th>
                <th style={{ padding: 8, textAlign: "right" }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, i) => (
                <tr key={i}>
                  <td style={{ padding: 8 }}>{i + 1}</td>
                  <td style={{ padding: 8 }}>{item.id_produk}</td>
                  <td style={{ padding: 8 }}>{item.nama}</td>
                  <td style={{ padding: 8, textAlign: "right" }}>{item.jumlah}</td>
                  <td style={{ padding: 8, textAlign: "right" }}>
                    Rp {item.harga.toLocaleString("id-ID")}
                  </td>
                  <td style={{ padding: 8, textAlign: "right" }}>
                    Rp {item.subtotal.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
          <div style={{ width: 250 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Subtotal</span>
              <span>Rp {data.total.toLocaleString("id-ID")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Pajak</span>
              <span>Rp {data.pajak.toLocaleString("id-ID")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Diskon</span>
              <span>Rp {data.diskon.toLocaleString("id-ID")}</span>
            </div>
            <div style={{
              marginTop: 8,
              paddingTop: 8,
              borderTop: "1px solid #e5e7eb",
              fontWeight: 700,
              display: "flex",
              justifyContent: "space-between"
            }}>
              <span>Total Bayar</span>
              <span>Rp {data.total_bayar.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, textAlign: "right" }}>
        </div>
      </div>
    </div>
  );
}