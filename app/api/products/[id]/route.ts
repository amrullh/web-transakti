// app/api/products/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
type Props = {
    params: Promise<{ id: string }>;
};
export async function PUT(request: Request, props: Props) {
    try {

        const params = await props.params;
        const id = params.id;
        const body = await request.json();
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);
        if (!productSnap.exists()) {
            return NextResponse.json({ error: "Produk tidak ditemukan di database" }, { status: 404 });
        }
        const { id: _, ...updateData } = body;
        await updateDoc(productRef, {
            ...updateData,
            updated_at: new Date().toISOString(),
        });
        return NextResponse.json({ message: "Produk berhasil diperbarui" });
    } catch (error: any) {
        console.error("API PUT Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
export async function DELETE(request: Request, props: Props) {
    try {
        const params = await props.params;
        const id = params.id;
        const productRef = doc(db, "products", id);
        const productSnap = await getDoc(productRef);
        if (!productSnap.exists()) {
            return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
        }
        await updateDoc(productRef, {
            status: "Nonaktif",
            updated_at: new Date().toISOString(),
        });

        return NextResponse.json({ message: "Produk dinonaktifkan" });
    } catch (error: any) {
        console.error("API DELETE Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}