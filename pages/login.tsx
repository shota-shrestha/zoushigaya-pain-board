import { useState } from "react";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/post");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">ログイン</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full">
          ログイン
        </Button>
      </form>

      <p className="text-sm text-center mt-6 text-gray-500">
        アカウントをお持ちでない方は{" "}
        <a href="/signup" className="text-blue-600 hover:underline">
          新規登録はこちら
        </a>
      </p>
    </div>
  );
}
