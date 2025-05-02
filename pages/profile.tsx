import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

export default function Profile() {
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setUserId(user.uid);
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setName(data.displayName || "");
          setAvatarUrl(data.avatarUrl || "");
        }
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const handleSave = async () => {
    if (!userId) return;
    const ref = doc(db, "users", userId);
    await setDoc(ref, { displayName: name, avatarUrl }, { merge: true });
    alert("プロフィールを更新しました！");
  };

  if (loading) return <p className="p-6">読み込み中...</p>;

  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">プロフィール編集</h1>
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="表示名"
      />
      <Input
        type="url"
        value={avatarUrl}
        onChange={(e) => setAvatarUrl(e.target.value)}
        placeholder="プロフィール画像URL（例: https://...jpg）"
      />
      <Button onClick={handleSave} className="w-full">
        保存する
      </Button>
    </div>
  );
}
