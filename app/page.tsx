import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {

  const cookieStore = await cookies();
  const token = cookieStore.get?.("token")?.value ?? null;

  if (token) redirect("/dashboard/kelola-outlet");
  redirect("/auth/login");
}
