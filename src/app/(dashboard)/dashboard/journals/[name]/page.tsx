import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { JournalDetailSkeleton } from "@/components/journals/journal-detail-skeleton";
import { JournalContent } from "@/components/journals/journal-content";

export default async function JournalPage({
  params,
}: {
  params: { name: string };
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <Suspense fallback={<JournalDetailSkeleton />}>
      <JournalContent params={params} />
    </Suspense>
  );
}
