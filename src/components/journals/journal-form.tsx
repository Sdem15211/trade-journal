"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomFieldForm } from "./custom-field-form";
import { createJournal } from "@/app/actions/journal";
import type { CreateJournalInput } from "@/app/actions/journal";
import { useToast } from "@/hooks/use-toast";
import { useActionState } from "react";

export function JournalForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [customFields, setCustomFields] = useState<
    CreateJournalInput["fields"]
  >([]);

  const [state, formAction, isPending] = useActionState(
    createJournal,
    undefined
  );

  useEffect(() => {
    if (state?.error) {
      toast({
        title: "Error",
        description:
          typeof state.error === "string"
            ? state.error
            : "Failed to create journal",
        variant: "destructive",
      });
    } else if (state?.success) {
      toast({
        title: "Success",
        description: "Journal created successfully",
      });
      router.push("/dashboard/journals");
    }
  }, [state, toast, router]);

  const handleAddField = () => {
    setCustomFields([
      ...customFields,
      { name: "", type: "TEXT", required: false },
    ]);
  };

  const handleUpdateField = (
    index: number,
    field: CreateJournalInput["fields"][number]
  ) => {
    const newFields = [...customFields];
    newFields[index] = field;
    setCustomFields(newFields);
  };

  const handleRemoveField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  return (
    <form action={formAction}>
      <input type="hidden" name="fields" value={JSON.stringify(customFields)} />
      <Card>
        <CardHeader>
          <CardTitle>Journal Details</CardTitle>
          {state?.error && (
            <div className="text-destructive text-sm mt-2">
              {Array.isArray(state.error)
                ? state.error.map((issue) => issue.message).join(", ")
                : state.error}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Journal Name</Label>
            <Input id="name" name="name" disabled={isPending} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              disabled={isPending}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Custom Fields</h3>
              <Button
                type="button"
                onClick={handleAddField}
                disabled={isPending}
              >
                Add Field
              </Button>
            </div>

            {customFields.map((field, index) => (
              <CustomFieldForm
                key={index}
                field={{
                  type: field.type,
                  name: field.name || "",
                  options: field.options,
                  required: field.required,
                }}
                onUpdate={(field) => handleUpdateField(index, field)}
                onRemove={() => handleRemoveField(index)}
                disabled={isPending}
              />
            ))}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              Create Journal
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
