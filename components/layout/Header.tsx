import Link from "next/link";
import { useRouter } from "next/router";
import { auth } from "../../firebase";
import { Button } from "../ui/button";
import { Pencil, List, BarChart, User, LogOut, LogIn } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Header() {
  const router = useRouter();
  const { user } = useAuth();

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/login");
  };

  const navItems = user
    ? [
        { href: "/post", icon: <Pencil size={18} />, label: "投稿" },
        { href: "/timeline", icon: <List size={18} />, label: "タイムライン" },
        { href: "/board", icon: <BarChart size={18} />, label: "ランキング" },
        { href: "/profile", icon: <User size={18} />, label: "プロフィール" },
      ]
    : [
        { href: "/login", icon: <LogIn size={18} />, label: "ログイン" },
        { href: "/signup", icon: <User size={18} />, label: "新規登録" },
      ];

  return (
    <header className="flex justify-between items-center px-4 py-3 border-b shadow-sm bg-white sticky top-0 z-50">
      <nav className="flex gap-4 text-sm font-medium">
        {navItems.map(({ href, icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
          >
            {icon}
            <span className="hidden sm:inline">{label}</span>
          </Link>
        ))}
      </nav>
      {user && (
        <Button variant="ghost" size="icon" onClick={handleLogout} title="ログアウト">
          <LogOut size={18} />
        </Button>
      )}
    </header>
  );
}
