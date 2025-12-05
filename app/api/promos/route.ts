//app/api/promos/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, query } from "firebase/firestore";

export async function GET() {
  try {
    const promosRef = collection(db, "promos");
    const q = query(promosRef);
    const snapshot = await getDocs(q);

    const promos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(promos);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { nama, tipe, nilai, produk, produk_ids, tanggal_mulai, tanggal_berakhir } = body;

    if (!nama || !nilai || !tanggal_mulai || !tanggal_berakhir) {
      return NextResponse.json({ error: "Mohon lengkapi data promo" }, { status: 400 });
    }

    const newPromo = {
      nama_promo: nama,
      jenis_promo: tipe,
      nilai: Number(nilai),
      produk_ids: produk_ids || [],
      produk_display: produk || "",
      tanggal_mulai,
      tanggal_selesai: tanggal_berakhir,
      status_aktif: true,
      createdAt: new Date().toISOString()
    };

    await addDoc(collection(db, "promos"), newPromo);

    return NextResponse.json({ message: "Promo berhasil dibuat" }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating promo:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}