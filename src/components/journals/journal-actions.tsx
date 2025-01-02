"use client";

import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteJournal } from "@/app/actions/journal";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface JournalActionsProps {
  journalId: string;
  journalName: string;
}

export function JournalActions({
  journalId,
  journalName,
}: JournalActionsProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    const result = await deleteJournal(journalId);

    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Journal deleted successfully",
      });
      router.refresh();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push(`/dashboard/journals/${journalId}/edit`)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Modify
          </DropdownMenuItem>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-destructive cursor-pointer">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the journal &quot;{journalName}&quot;
            and all its associated trades. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
