import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { format } from "date-fns";
import { Heart } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../components/ui/card";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";

type Pain = {
  id: string;
  text: string;
  userId: string;
  createdAt: any;
  likedBy?: string[];
  tags?: string[];
};

type UserInfo = {
  displayName: string;
  avatarUrl?: string;
};

export default function Board() {
  const [pains, setPains] = useState<Pain[]>([]);
  const [userMap, setUserMap] = useState<Record<string, UserInfo>>({});
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const map: Record<string, UserInfo> = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        map[doc.id] = {
          displayName: data.displayName || "匿名ユーザー",
          avatarUrl: data.avatarUrl || "/default-avatar.png",
        };
      });
      setUserMap(map);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pains"), (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Pain),
      }));

      results.sort((a, b) => (b.likedBy?.length ?? 0) - (a.likedBy?.length ?? 0));
      setPains(results.slice(0, 10));
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p className="p-6">読み込み中...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">共感ランキング TOP10</h1>
      <div className="space-y-4">
        {pains.map((pain, index) => {
          const userInfo = userMap[pain.userId] || {
            displayName: "匿名ユーザー",
            avatarUrl: "/default-avatar.png",
          };

          return (
            <Card key={pain.id} className="shadow-sm border">
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <img
                    src={userInfo.avatarUrl}
                    alt="avatar"
                    className="rounded-full object-cover inline-block shrink-0"
                    style={{ width: "32px", height: "32px" }}
                  />
                  {userInfo.displayName}
                </div>
                <p className="text-base whitespace-pre-wrap">{pain.text}</p>
              </CardHeader>
              <CardContent className="text-sm text-gray-500 space-y-2">
                {pain.createdAt?.toDate
                  ? format(pain.createdAt.toDate(), "yyyy年MM月dd日 HH:mm")
                  : "日時不明"}

                {pain.tags && pain.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {pain.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end text-sm text-pink-600">
                <Heart size={16} className="mr-1" />
                共感 {pain.likedBy?.length ?? 0} 件
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
