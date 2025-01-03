import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-2">
      <h2 className="text-2xl font-semibold">Journal not found</h2>
      <p className="text-muted-foreground">
        The journal you&apos;re looking for doesn&apos;t exist or you don&apos;t
        have access to it.
      </p>
      <Button asChild className="mt-4">
        <Link href="/dashboard/journals">Back to Journals</Link>
      </Button>
    </div>
  );
}
