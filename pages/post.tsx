import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useRouter } from "next/router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function PostPage() {
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
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
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      await addDoc(collection(db, "pains"), {
        text,
        tags: tagArray,
        userId: user.uid,
        createdAt: serverTimestamp(),
        likedBy: [],
      });

      router.push("/timeline"); // ✅ 投稿完了後にリダイレクト
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p className="p-6">読み込み中...</p>;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">悩みを投稿する</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="あなたの悩みを書いてみよう"
          className="w-full h-32 border p-2 rounded"
        />
        <Input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="タグをカンマで区切って入力（例: 育児, 仕事）"
        />
        <Button type="submit" className="w-full">
          投稿する
        </Button>
      </form>
    </div>
  );
}
