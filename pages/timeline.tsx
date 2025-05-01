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
import { Heart } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";

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
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">みんなの悩み（Threads風）</h1>
      <div className="space-y-4">
        {pains.map((pain) => {
          const liked = pain.likedBy?.includes(userId ?? "") ?? false;
          return (
            <Card key={pain.id} className="shadow-sm border">
              <CardHeader>
                <p className="text-base whitespace-pre-wrap">{pain.text}</p>
              </CardHeader>
              <CardContent className="text-sm text-gray-500">
                {pain.createdAt?.toDate
                  ? format(pain.createdAt.toDate(), "yyyy年MM月dd日 HH:mm")
                  : "日時不明"}
              </CardContent>
              <CardFooter className="flex justify-between text-sm">
                <span className="text-gray-600">
                  共感 {pain.likedBy?.length ?? 0} 件
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleLike(pain.id)}
                >
                  <Heart
                    size={16}
                    className={liked ? "text-pink-600 fill-pink-600" : "text-gray-400"}
                  />
                  <span className="ml-1">{liked ? "共感済み" : "共感する"}</span>
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
