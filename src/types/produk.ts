// File: src/types/produk.ts

export interface IProduk {
  id: string;
  nama: string;
  kodeProduk: string | null;
  hargaJual: number;
  hargaModal: number; 
  stok: number;
  kategori: string;
  status: 'Aktif' | 'Nonaktif';
}