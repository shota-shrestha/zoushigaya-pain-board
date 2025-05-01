import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  arrayUnion,
  doc,
} from "firebase/firestore";
import { format } from "date-fns";
import { onAuthStateChanged } from "firebase/auth";

type Pain = {
  id: string;
  text: string;
  userId: string;
  createdAt: any;
  likedBy?: string[];
};

export default function Timeline() {
  const [pains, setPains] = useState<Pain[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  // ログイン状態の監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid ?? null);
    });
    return () => unsubscribe();
  }, []);

  // 投稿一覧取得
  useEffect(() => {
    const q = query(collection(db, "pains"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Pain),
      }));
      setPains(results);
    });
    return () => unsubscribe();
  }, []);

  // 共感ボタンの処理
  const handleLike = async (id: string) => {
    if (!userId) {
      alert("ログインしてください");
      return;
    }

    const target = pains.find((p) => p.id === id);
    if (target?.likedBy?.includes(userId)) return;

    const ref = doc(db, "pains", id);
    await updateDoc(ref, {
      likedBy: arrayUnion(userId),
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">みんなの悩み（新着順）</h1>
      {pains.length === 0 ? (
        <p className="text-gray-500">まだ投稿がありません。</p>
      ) : (
        <ul className="space-y-4">
          {pains.map((pain) => (
            <li key={pain.id} className="p-4 border rounded">
              <p className="mb-2">{pain.text}</p>
              <p className="text-sm text-gray-500">
                {pain.createdAt?.toDate
                  ? format(pain.createdAt.toDate(), "yyyy年MM月dd日 HH:mm")
                  : "日時不明"}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span>共感 {pain.likedBy?.length ?? 0} 件</span>
                <button
                  onClick={() => handleLike(pain.id)}
                  className="bg-pink-600 text-white px-3 py-1 rounded text-sm"
                >
                  共感する
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
