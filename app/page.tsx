import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function HomePage() {
  const cookieStore: any = cookies();   // workaround TS
  const token = cookieStore.get?.("token")?.value ?? null;

  if (token) redirect("/dashboard/kelola-outlet");
  redirect("/auth/login");
}
