"use client";

import modal from "../Modal.module.css";

export default function ModalBarcodeQuestion({ onClose, onChoose }: { onClose: () => void; onChoose: (v: boolean) => void; }) {
  return (
    <div className={modal.overlay}>
      <div className={modal.modal}>
        <h3 className={modal.modalTitle} style={{ textAlign: "center" }}>Apakah produk memiliki barcode?</h3>

        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 12 }}>
          <button className={modal.btnSecondary} onClick={() => { onChoose(true); onClose(); }}>YA</button>
          <button className={modal.btnPrimary} onClick={() => { onChoose(false); onClose(); }}>TIDAK</button>
        </div>
      </div>
    </div>
  );
}