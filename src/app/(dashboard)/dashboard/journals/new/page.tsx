import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { JournalForm } from "@/components/journals/journal-form";

export default async function NewJournalPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Create New Journal</h1>
        </div>
      </div>
      <JournalForm />
    </div>
  );
}
