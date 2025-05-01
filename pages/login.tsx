import { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  signInAnonymously,
} from "firebase/auth";
import { useRouter } from "next/router";

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

  const handleAnonymousLogin = async () => {
    try {
      await signInAnonymously(auth);
      router.push("/post");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">ログイン</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border"
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2">
          ログイン
        </button>
      </form>

      <div className="my-6 text-center text-sm text-gray-500">または</div>

      <button
        onClick={handleAnonymousLogin}
        className="w-full bg-gray-800 text-white p-2"
      >
        匿名ログイン
      </button>
    </div>
  );
}export default function Login() {
  return <h1>Login Page</h1>;
}
