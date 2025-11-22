"use client";

import modal from "../Modal.module.css";
import { ProductType } from "../page";

export default function ModalHapusProduk({ data, onClose, onConfirm }: { data: ProductType; onClose: () => void; onConfirm: () => void; }) {
  return (
    <div className={modal.overlay}>
      <div className={modal.modal}>
        <h3 className={modal.modalTitle} style={{ textAlign: "center" }}>Anda yakin ingin menonaktifkan produk ini?</h3>

        <div style={{ marginTop: 8, textAlign: "center" }}>
          <div><strong>{data.nama}</strong></div>
        </div>

        <div className={modal.modalButtons}>
          <button className={modal.btnSecondary} onClick={onClose}>Batal</button>
          <button className={modal.btnPrimary} style={{ background: "#b32626" }} onClick={() => { onConfirm(); onClose(); }}>Nonaktifkan</button>
        </div>
      </div>
    </div>
  );
}