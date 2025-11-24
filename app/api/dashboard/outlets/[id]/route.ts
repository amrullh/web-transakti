import { NextResponse } from "next/server";
import { db } from "@/lib/firebase"; // Pastikan path ini benar
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

// PUT/PATCH (Edit Outlet)
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const outletId = params.id;
        const body = await request.json();
        const { namaToko, alamat, jenisBisnis, kategori } = body;

        if (!namaToko || !jenisBisnis || !kategori) {
             return NextResponse.json({ error: "Missing required fields for update" }, { status: 400 });
        }

        const outletRef = doc(db, "outlets", outletId);
        
        await updateDoc(outletRef, {
            namaToko: namaToko,
            alamat: alamat || "",
            jenisBisnis: jenisBisnis,
            kategori: kategori,
            updatedAt: new Date().toISOString(),
        });

        return NextResponse.json({ message: `Outlet ${outletId} berhasil diupdate` });
    } catch (error: any) {
        console.error("API PUT Outlet Error:", error);
        return NextResponse.json({ error: "Failed to update outlet: " + error.message }, { status: 500 });
    }
}

// DELETE (Hapus Outlet)
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const outletId = params.id;
        
        const outletRef = doc(db, "outlets", outletId);
        await deleteDoc(outletRef);

        return NextResponse.json({ message: `Outlet ${outletId} berhasil dihapus` });
    } catch (error: any) {
        console.error("API DELETE Outlet Error:", error);
        return NextResponse.json({ error: "Failed to delete outlet: " + error.message }, { status: 500 });
    }
}