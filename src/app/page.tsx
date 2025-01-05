import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-4xl font-bold">Welcome to the App</h1>
      <Button asChild>
        <Link href={session?.user ? "/dashboard" : "/login"}>
          {session?.user ? "Go to Dashboard" : "Login here"}
        </Link>
      </Button>
    </div>
  );
}
