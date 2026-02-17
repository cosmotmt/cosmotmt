import { redirect } from "next/navigation";

export default function AdminPage() {
  // /admin にアクセスしたら /admin/dashboard に飛ばす
  redirect("/admin/dashboard");
}
