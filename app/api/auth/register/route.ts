import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { uid, phone, password, storeName, businessType } = body;
        await setDoc(doc(db, "users", uid), {
            uid,
            phoneNumber: phone,
            role: 'owner',
            password,
            createdAt: new Date().toISOString(),
        });

        const outletId = `outlet_${Date.now()}`;
        await setDoc(doc(db, "outlets", outletId), {
            id: outletId,
            ownerId: uid,
            namaToko: storeName,
            jenisBisnis: businessType,
            createdAt: new Date().toISOString(),
        });

        return NextResponse.json({ message: "Registrasi sukses" });
    } catch (error: any) {
        console.error("API Register Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}