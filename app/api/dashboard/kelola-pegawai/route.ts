import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where, setDoc, doc } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";

export async function GET() {
    try {
        const q = query(collection(db, "users"), where("role", "==", "pegawai"));
        const querySnapshot = await getDocs(q);

        const employees = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json(employees);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { nama, telepon, password, alamat, tanggalDiterima, foto } = body;
        const firebaseConfig = {
            apiKey: "AIzaSyB6PurRc1PN8Rd5emHQfz8YUslSqwdFOEw",
            authDomain: "auth-firebase-9a3d2.firebaseapp.com",
            projectId: "auth-firebase-9a3d2",
            storageBucket: "auth-firebase-9a3d2.firebasestorage.app",
            messagingSenderId: "916804052494",
            appId: "1:916804052494:web:67cccc45c94170948cfe5f"
        };
        const secondaryAppName = "SecondaryAppAPI";
        let secondaryApp = getApps().find(app => app.name === secondaryAppName)
            || initializeApp(firebaseConfig, secondaryAppName);

        const secondaryAuth = getAuth(secondaryApp);
        const emailPegawai = `${telepon}@transakti.com`;
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, emailPegawai, password);
        const uidPegawai = userCredential.user.uid;
        const newUser = {
            uid: uidPegawai,
            nama, telepon, password, alamat, tanggalDiterima, foto,
            status: "Aktif",
            role: "pegawai",
            createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, "users", uidPegawai), newUser);
        await signOut(secondaryAuth);
        return NextResponse.json({ message: "Sukses", data: newUser });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}