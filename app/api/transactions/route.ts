// app/api/transactions/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import {
    collection,
    runTransaction,
    doc,
    serverTimestamp,
    query,
    where,
    getDocs
} from "firebase/firestore";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {
            items,
            total,
            subtotal,
            diskon: totalDiskonInput,
            pajak,
            paymentMethod,
            customerName,
            outletId,
            pegawaiInfo
        } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Keranjang kosong" }, { status: 400 });
        }
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const today = `${year}-${month}-${day}`;

        const promosRef = collection(db, "promos");
        const qPromo = query(promosRef, where("status_aktif", "==", true));
        const promoSnap = await getDocs(qPromo);

        const activePromos = promoSnap.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as any))
            .filter(p => p.tanggal_mulai <= today && p.tanggal_selesai >= today);

        const getProductDiscount = (prodId: string, prodName: string, prodPrice: number) => {
            let promo = activePromos.find(p => p.produk_ids && p.produk_ids.includes(prodId));
            if (!promo) {
                promo = activePromos.find(p =>
                    p.produk_terkait && p.produk_terkait.some((t: string) => {
                        const tClean = t.toLowerCase().trim();
                        const pClean = prodName.toLowerCase().trim();
                        return pClean === tClean || pClean.includes(tClean);
                    })
                );
            }
            if (!promo) return { nilai: 0, promoId: null };

            let discountAmount = 0;
            if (promo.jenis_promo === "Persentase (%)") {
                discountAmount = (prodPrice * promo.nilai) / 100;
            } else {
                discountAmount = promo.nilai;
            }
            return { nilai: discountAmount, promoId: promo.id };
        };
        await runTransaction(db, async (transaction) => {
            
            const productReads = [];

            for (const item of items) {
                const productRef = doc(db, "products", String(item.id));
                const productSnap = await transaction.get(productRef);

                if (!productSnap.exists()) {
                    throw `Produk "${item.nama}" tidak ditemukan/sudah dihapus.`;
                }
                productReads.push({
                    itemInfo: item, 
                    productRef: productRef,
                    productData: productSnap.data() 
                });
            }
            const transactionItems = [];
            let calculatedTotalDiscount = 0;

            for (const readResult of productReads) {
                const { itemInfo, productRef, productData } = readResult;
                const currentStock = Number(productData.stok);
                if (currentStock < itemInfo.qty) {
                    throw `Stok "${itemInfo.nama}" tidak cukup. Sisa: ${currentStock}`;
                }

                transaction.update(productRef, {
                    stok: currentStock - itemInfo.qty
                });
                const { nilai: discountPerItem, promoId } = getProductDiscount(
                    String(itemInfo.id),
                    itemInfo.nama,
                    Number(productData.harga_jual)
                );
                const totalDiscountForItem = discountPerItem * itemInfo.qty;
                calculatedTotalDiscount += totalDiscountForItem;

                transactionItems.push({
                    id_produk: String(itemInfo.id),
                    nama_produk: itemInfo.nama,
                    harga_satuan: Number(productData.harga_jual),
                    jumlah: itemInfo.qty,
                    diskon_per_item: discountPerItem,
                    id_promo: promoId || null,
                    subtotal: (Number(productData.harga_jual) - discountPerItem) * itemInfo.qty
                });
            }
            const newTrxRef = doc(collection(db, "transactions"));
            const trxData = {
                id_transaksi: newTrxRef.id,
                id_outlet: outletId || "OUT001",
                kasir: pegawaiInfo?.nama || "Staff",
                nama_pelanggan: customerName || "Umum",
                subtotal_transaksi: Number(subtotal),
                nilai_diskon_total: Number(totalDiskonInput || calculatedTotalDiscount),
                nilai_pajak_diterapkan: Number(pajak),
                harga_total: Number(total),
                metode: paymentMethod,
                items: transactionItems,
                tanggal: new Date().toISOString().split('T')[0],
                waktu: new Date().toLocaleTimeString('id-ID'),
                createdAt: serverTimestamp()
            };

            transaction.set(newTrxRef, trxData);
        });
        return NextResponse.json({ message: "Transaksi Berhasil Disimpan" }, { status: 201 });
    } catch (error: any) {
        console.error("Transaction Error:", error);
        return NextResponse.json({
            error: typeof error === 'string' ? error : "Terjadi kesalahan pada server"
        }, { status: 500 });
    }
}