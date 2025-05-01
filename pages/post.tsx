import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function PostPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(collection(db, "pains"), {
        text,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      alert("投稿されました！");
      setText("");
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p>読み込み中...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">悩みを投稿する</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="あなたの悩みを書いてください"
          className="w-full h-32 border p-2"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2">
          投稿する
        </button>
      </form>
    </div>
  );
}
