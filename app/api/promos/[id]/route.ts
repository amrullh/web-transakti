// app/api/promo/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, deleteDoc } from "firebase/firestore";

type Props = {
    params: Promise<{ id: string }>;
};

// DELETE: Hapus Promo
export async function DELETE(request: Request, props: Props) {
    try {
        const params = await props.params;
        const id = params.id;

        await deleteDoc(doc(db, "promos", id));

        return NextResponse.json({ message: "Promo berhasil dihapus" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}