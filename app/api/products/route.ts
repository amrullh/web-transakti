import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    setDoc,
    doc,
    query
} from "firebase/firestore";
export async function GET(request: Request) {
    try {
        const productsRef = collection(db, "products");
        const q = query(productsRef);
        const snapshot = await getDocs(q);

        const products = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        products.sort((a, b) => Number(a.id) - Number(b.id));

        return NextResponse.json(products);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.nama || !body.harga_jual || !body.kategori) {
            return NextResponse.json({ error: "Data wajib belum lengkap!" }, { status: 400 });
        }
        const productsRef = collection(db, "products");
        const snapshot = await getDocs(productsRef);
        const existingIds = snapshot.docs
            .map(doc => parseInt(doc.id))
            .filter(id => !isNaN(id))
            .sort((a, b) => a - b);
        let newId = 1;
        for (const id of existingIds) {
            if (id === newId) {
                newId++;
            } else if (id > newId) {
                break;
            }
        }


        const newProduct = {
            nama: body.nama,
            kode_produk: body.kode_produk || null,
            kategori: body.kategori,
            harga_modal: Number(body.harga_modal),
            harga_jual: Number(body.harga_jual),
            stok: Number(body.stok) || 0,
            gambar_produk: body.gambar || "",
            status: "Aktif",
            outlet_id: "OUT001",
            created_at: new Date().toISOString(),
        };



        await setDoc(doc(db, "products", String(newId)), newProduct);

        return NextResponse.json({ message: "Produk berhasil ditambahkan", id: String(newId) }, { status: 201 });
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}