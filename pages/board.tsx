import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";
import { format } from "date-fns";
import { Heart } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";

type Pain = {
  id: string;
  text: string;
  userId: string;
  createdAt: any;
  likedBy?: string[];
};

export default function Board() {
  const [pains, setPains] = useState<Pain[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pains"), (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Pain),
      }));

      // 共感数で降順ソート
      results.sort((a, b) => (b.likedBy?.length ?? 0) - (a.likedBy?.length ?? 0));

      setPains(results.slice(0, 10)); // 上位10件のみ
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">共感ランキング TOP10</h1>
      <div className="space-y-4">
        {pains.map((pain, index) => (
          <Card key={pain.id} className="shadow-sm border">
            <CardHeader>
              <div className="text-sm text-gray-500">#{index + 1}</div>
              <p className="text-base whitespace-pre-wrap">{pain.text}</p>
            </CardHeader>
            <CardContent className="text-sm text-gray-500">
              {pain.createdAt?.toDate
                ? format(pain.createdAt.toDate(), "yyyy年MM月dd日 HH:mm")
                : "日時不明"}
            </CardContent>
            <CardFooter className="flex justify-end text-sm text-pink-600">
              <Heart size={16} className="mr-1" />
              共感 {pain.likedBy?.length ?? 0} 件
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
