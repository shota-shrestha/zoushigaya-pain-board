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
    <header className="flex justify-between items-center px-4 py-3 border-b shadow-sm">
      <nav className="space-x-4">
        <Link href="/post" className="text-sm font-medium hover:underline">
          投稿
        </Link>
        <Link href="/timeline" className="text-sm font-medium hover:underline">
          タイムライン
        </Link>
        <Link href="/board" className="text-sm font-medium hover:underline">
          ランキング
        </Link>
      </nav>
      <Button variant="outline" size="sm" onClick={handleLogout}>
        ログアウト
      </Button>
    </header>
  );
}
