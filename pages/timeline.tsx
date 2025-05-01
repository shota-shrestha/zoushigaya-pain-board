import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  arrayUnion,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { format } from "date-fns";
import { Button } from "../components/ui/button"; // 相対パスに修正！

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user?.uid ?? null);
    });
    return () => unsubscribe();
  }, []);

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
      <h1 className="text-3xl font-bold mb-6">みんなの悩み（新着順）</h1>
      <div className="space-y-4">
        {pains.map((pain) => (
          <div
            key={pain.id}
            className="border rounded-xl p-4 shadow-sm bg-white"
          >
            <p className="mb-2 text-base">{pain.text}</p>
            <div className="text-sm text-gray-500 mb-3">
              {pain.createdAt?.toDate
                ? format(pain.createdAt.toDate(), "yyyy年MM月dd日 HH:mm")
                : "日時不明"}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">
                共感 {pain.likedBy?.length ?? 0} 件
              </span>
              <Button
                variant="default"
                size="sm"
                onClick={() => handleLike(pain.id)}
              >
                共感する
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
