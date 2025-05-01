import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { format } from "date-fns";

type Pain = {
  id: string;
  text: string;
  userId: string;
  createdAt: any;
};

export default function Timeline() {
  const [pains, setPains] = useState<Pain[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "pains"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Pain[];
      setPains(results);
    });
    return () => unsubscribe();
  }, []);

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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
