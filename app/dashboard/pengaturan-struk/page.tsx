"use client";
import React, { useState } from "react";
import { Pencil, Eye, X } from "lucide-react";
import "./struk.css";

interface SettingItemProps {
  label: string;
  onEdit: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ label, onEdit }) => (
  <div className="setting-item">
    <span className="setting-label">{label}</span>

    <button className="edit-btn" onClick={onEdit}>
      <Pencil className="icon" />
    </button>
  </div>
);

export default function PengaturanStrukKonten() {
  const [headerText, setHeaderText] = useState("Header Struk");
  const [footerText, setFooterText] = useState("Terima Kasih");
  const [outletName, setOutletName] = useState("Cantik Madura");

  const [editType, setEditType] = useState<"header" | "footer" | null>(null);
  const [tempValue, setTempValue] = useState("");

  const [showPreview, setShowPreview] = useState(false);
  const [isDiscountEnabled, setIsDiscountEnabled] = useState(true);

  const openEditModal = (type: "header" | "footer") => {
    setEditType(type);
    setTempValue(type === "header" ? headerText : footerText);
  };

  const saveEdit = () => {
    if (editType === "header") setHeaderText(tempValue);
    if (editType === "footer") setFooterText(tempValue);
    setEditType(null);
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Pengaturan Struk</h2>

      <div className="preview-container">
        <button onClick={() => setShowPreview(true)} className="preview-btn">
          <Eye className="icon" />
          Lihat Tampilan Struk
        </button>
      </div>

      <div className="content-box">
        <SettingItem label="Header Struk" onEdit={() => openEditModal("header")} />
        <SettingItem label="Footer Struk" onEdit={() => openEditModal("footer")} />

        <div className="setting-item">
          <span className="setting-label">Diskon</span>

          <button
            onClick={() => setIsDiscountEnabled(!isDiscountEnabled)}
            className={`toggle ${isDiscountEnabled ? "on" : "off"}`}
          >
            <span className="toggle-ball"></span>
          </button>
        </div>
      </div>

      {editType && (
        <div className="overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setEditType(null)}>
              <X className="icon" />
            </button>

            <h3>{editType === "header" ? "Edit Header" : "Edit Footer"}</h3>

            <textarea
              rows={3}
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              style={{ width: "100%", marginTop: 12 }}
            ></textarea>

            <button className="preview-btn" style={{ marginTop: 16 }} onClick={saveEdit}>
              Simpan
            </button>
          </div>
        </div>
      )}

      {showPreview && (
        <ModalPreview
          close={() => setShowPreview(false)}
          header={headerText}
          footer={footerText}
          outletName={outletName}
          isDiscountEnabled={isDiscountEnabled} 
        />
      )}
    </div>
  );
}

function ModalPreview({
  close,
  header,
  footer,
  outletName,
  isDiscountEnabled,
}: {
  close: () => void;
  header: string;
  footer: string;
  outletName: string;
  isDiscountEnabled: boolean;
}) {
  return (
    <div className="overlay">
      <div className="modal">
        <button className="close-btn" onClick={close}>
          <X className="icon" />
        </button>

        <div className="receipt-box">
          <h2 className="receipt-title">{outletName}</h2>
          <p className="receipt-subtitle">{header}</p>

          <div className="receipt-row">
            <span>Tanggal</span>
            <span>01/10/2025</span>
          </div>

          <div className="receipt-row">
            <span>Kasir</span>
            <span>Budi</span>
          </div>

          <hr />

          <div className="receipt-list">
            <div className="receipt-row">
              <span>Nama barang</span>
              <span>Rp10.000</span>
            </div>
            <div className="receipt-row">
              <span>Nama barang</span>
              <span>Rp10.000</span>
            </div>

            {isDiscountEnabled && ( 
              <div className="receipt-row faded">
                <span>Diskon</span>
                <span>Rp1.500</span>
              </div>
            )}
          </div>

          <hr />

          <div className="receipt-summary">
            <div className="receipt-row">
              <span>Subtotal</span>
              <span>Rp48.500</span>
            </div>
            <div className="receipt-row">
              <span>Pajak (10%)</span>
              <span>Rp4.850</span>
            </div>
            <div className="receipt-row total">
              <span>Total</span>
              <span>Rp53.350</span>
            </div>
          </div>

          <div className="receipt-footer">
            <p>{footer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
