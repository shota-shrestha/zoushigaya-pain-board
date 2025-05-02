import Link from "next/link";
import { Button } from "../components/ui/button";

export default function Home() {
  return (
    <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6">
      <h1 className="text-3xl font-bold">Zoushigaya Pain Board</h1>
      <p className="text-gray-600 text-sm leading-relaxed">
        Zoushigaya Pain Board は、雑司が谷エリアの悩みや困りごとを共有し、<br />
        共感し合うための匿名SNSです。<br />
        会員登録をすると、悩みの投稿・共感・コメントができます。
      </p>
      <Link href="/signup">
        <Button className="mt-4">会員登録してはじめる</Button>
      </Link>
    </div>
  );
}
