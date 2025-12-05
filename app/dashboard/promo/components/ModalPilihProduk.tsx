// ModalPilihProduk.tsx
"use client";
import { useState, useEffect } from "react";
type Product = {
    id: string;
    nama: string;
    status: "Aktif" | "Nonaktif";
};
type Props = {
    onClose: () => void;

    onSave: (selectedIds: string[], selectedNames: string[]) => void;
    alreadySelectedIds: string[];
};
export default function ModalPilihProduk({ onClose, onSave, alreadySelectedIds }: Props) {
    const [products, setProducts] = useState<Product[]>([]);

    const [selectedIds, setSelectedIds] = useState<string[]>(alreadySelectedIds || []);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/products?outletId=OUT001");
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data.filter((p: any) => p.status === "Aktif"));
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const toggleProduct = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(s => s !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };
    const handleSave = () => {

        const selectedNames = products
            .filter(p => selectedIds.includes(p.id))
            .map(p => p.nama);

        onSave(selectedIds, selectedNames);
    };
    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100
        }}>
            <div style={{
                background: 'white', padding: 25, borderRadius: 12, width: 400,
                maxHeight: '80vh', display: 'flex', flexDirection: 'column'
            }}>
                <h3 style={{ marginTop: 0, marginBottom: 15, color: '#205781' }}>Pilih Produk Promo</h3>

                <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #eee', borderRadius: 8, padding: 10 }}>
                    {loading ? <p>Memuat...</p> : products.length === 0 ? <p>Kosong.</p> : (
                        products.map(p => (
                            <div key={p.id} style={{
                                padding: '8px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 10
                            }}>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(p.id)}
                                    onChange={() => toggleProduct(p.id)}
                                    style={{ width: 18, height: 18, cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: 14 }}>{p.nama}</span>
                            </div>
                        ))
                    )}
                </div>

                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                    <button type="button" onClick={onClose} style={{ background: '#eee', border: 'none', padding: '10px 15px', borderRadius: 8, cursor: 'pointer' }}>Batal</button>
                    <button type="button" onClick={handleSave} style={{ background: '#205781', color: 'white', border: 'none', padding: '10px 15px', borderRadius: 8, cursor: 'pointer' }}>
                        Pilih ({selectedIds.length})
                    </button>
                </div>
            </div>
        </div>
    );
}