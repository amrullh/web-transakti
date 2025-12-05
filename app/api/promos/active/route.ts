
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";


export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const today = new Date().toISOString().split('T')[0];

        const promosRef = collection(db, "promos");

        const q = query(promosRef, where("status_aktif", "==", true));

        const querySnapshot = await getDocs(q);
        const activePromos = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));


        const validPromos = activePromos.filter((p: any) => {
            if (!p.tanggal_mulai || !p.tanggal_selesai) return true;
            return p.tanggal_selesai >= today && p.tanggal_mulai <= today;
        });

        return NextResponse.json(validPromos, {
            headers: {
                "Cache-Control": "no-store, max-age=0",
            },
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}