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
import { onAuthStateChanged } from "firebase/auth";
import { format } from "date-fns";
import { Heart } from "lucide-react";

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
    <div className="max-w-xl mx-auto border-l border-r min-h-screen">
      <h1 className="text-xl font-bold px-4 py-3 border-b">みんなの悩み</h1>
      <div>
        {pains.map((pain) => {
          const liked = pain.likedBy?.includes(userId ?? "") ?? false;
          return (
            <div key={pain.id} className="px-4 py-3 border-b hover:bg-muted">
              <p className="whitespace-pre-wrap text-sm">{pain.text}</p>
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>
                  {pain.createdAt?.toDate
                    ? format(pain.createdAt.toDate(), "yyyy年MM月dd日 HH:mm")
                    : "日時不明"}
                </span>
                <button
                  className="flex items-center gap-1"
                  onClick={() => handleLike(pain.id)}
                >
                  <Heart
                    size={16}
                    className={liked ? "text-pink-600 fill-pink-600" : "text-gray-400"}
                  />
                  <span>{pain.likedBy?.length ?? 0}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
