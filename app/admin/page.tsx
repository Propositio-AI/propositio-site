import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const AdminPage = async () => {
  let session = null;

  try {
    session = await auth();
  } catch {
    redirect("/admin/login");
  }

  if (!session) {
    redirect("/admin/login");
  }

  if (session.user?.email !== process.env.ADMIN_EMAIL) {
    redirect("/admin/login");
  }
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center flex flex-col items-center gap-10 sm:gap-15">
        <div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            ここは管理者専用のダッシュボードです。
          </p>
        </div>
        <div className="flex flex-col items-center gap-5">
          <Link href="/admin/contact" className="text-blue-500 hover:underline">
            お問い合わせ管理ページへ→
          </Link>
          <Link href="/admin/join" className="text-blue-500 hover:underline">
            参加応募管理ページへ→
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
