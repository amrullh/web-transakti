import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    doc, 
    setDoc 
} from "firebase/firestore";

// ==========================================================
// 1. GET Function (Mengambil semua outlet berdasarkan ownerId)
// ==========================================================
// Asumsi: uid owner dikirim sebagai query parameter
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const ownerId = searchParams.get("ownerId"); // Ambil ownerId dari query param

        if (!ownerId) {
            return NextResponse.json({ error: "Owner ID is required" }, { status: 400 });
        }

        const outletsRef = collection(db, "outlets");
        // Query untuk mencari outlet yang ownerId-nya sesuai
        const q = query(outletsRef, where("ownerId", "==", ownerId));

        const querySnapshot = await getDocs(q);
        const outlets: any[] = [];
        querySnapshot.forEach((document) => { // Ganti 'doc' menjadi 'document' untuk menghindari konflik
            const data = document.data();
            outlets.push({
                id: document.id, // ID dokumen Firestore
                ownerId: data.ownerId,
                nama: data.namaToko,
                alamat: data.alamat || "Alamat belum diset",
                // Menggabungkan jenisBisnis dan kategori menjadi array [kategori[0], kategori[1]]
                kategori: [data.jenisBisnis, data.kategori || 'Utama'], 
                warna: data.warna || "#d6e7ea",
                createdAt: data.createdAt,
            });
        });

        return NextResponse.json(outlets);
    } catch (error: any) {
        console.error("API GET Outlets Error:", error);
        return NextResponse.json({ error: "Failed to fetch outlets: " + error.message }, { status: 500 });
    }
}

// ==========================================================
// 2. POST Function (Menambah outlet baru)
// ==========================================================
export async function POST(request: Request) {
    try {
        const body = await request.json();
        // ownerId harus didapatkan dari data pengguna yang sudah terautentikasi 
        const { ownerId, namaToko, alamat, jenisBisnis, kategori } = body; 

        if (!ownerId || !namaToko || !jenisBisnis || !kategori) {
             return NextResponse.json({ 
                error: "Missing required fields: ownerId, namaToko, jenisBisnis, and kategori are required." 
            }, { status: 400 });
        }

        // Gunakan ID unik dari gabungan timestamp dan random string
        const outletId = `outlet_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        await setDoc(doc(db, "outlets", outletId), {
            ownerId: ownerId,
            namaToko: namaToko,
            alamat: alamat || "",
            jenisBisnis: jenisBisnis,
            kategori: kategori, 
            warna: "#d6e7ea", // Default color
            createdAt: new Date().toISOString(),
        });

        return NextResponse.json({ 
            message: "Outlet berhasil ditambahkan",
            outletId: outletId 
        }, { status: 201 });
    } catch (error: any) {
        console.error("API POST Outlet Error:", error);
        return NextResponse.json({ error: "Failed to add outlet: " + error.message }, { status: 500 });
    }
}