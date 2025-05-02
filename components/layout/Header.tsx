import Link from "next/link";
import { useRouter } from "next/router";
import { auth } from "../../firebase";
import { Button } from "../ui/button";

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
  };

  return (
    <header className="flex justify-between items-center px-4 py-3 border-b shadow-sm bg-white sticky top-0 z-50">
      <nav className="space-x-4 text-sm font-medium">
        <Link href="/post" className="hover:underline">投稿</Link>
        <Link href="/timeline" className="hover:underline">タイムライン</Link>
        <Link href="/board" className="hover:underline">ランキング</Link>
        <Link href="/profile" className="hover:underline">プロフィール</Link>
      </nav>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        ログアウト
      </Button>
    </header>
  );
}
