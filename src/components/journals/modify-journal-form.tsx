"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CustomFieldForm } from "./custom-field-form";
import { updateJournal } from "@/app/(server)/actions/journal";
import { useToast } from "@/hooks/use-toast";
import { useActionState } from "react";
import { CheckCircle2, PlusIcon } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { DefaultFieldDisplay } from "./default-field-display";
import { createSlug } from "@/lib/utils";
import type { Journal, JournalField } from "@prisma/client";

interface ModifyJournalFormProps {
  journal: Journal & {
    fields: JournalField[];
  };
}

export interface ActionResponse {
  success: boolean;
  message: string;
  errors?: {
    name?: string[];
    description?: string[];
    fields?: string[];
  };
  data?: any;
}

const initialState: ActionResponse = {
  success: false,
  message: "",
};

export function ModifyJournalForm({ journal }: ModifyJournalFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [customFields, setCustomFields] = useState<
    Array<{
      id?: string;
      type: "TEXT" | "SELECT" | "MULTI_SELECT";
      name: string;
      options?: string[];
      required: boolean;
    }>
  >(journal.fields);

  const [state, formAction, isPending] = useActionState(
    updateJournal,
    initialState
  );

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Success",
        description: state.message || "Journal updated successfully",
      });
      router.push(`/dashboard/journals/${createSlug(state.data.name)}`);
    }
  }, [state, toast, router]);

  const handleAddField = () => {
    setCustomFields((prev) => [
      ...prev,
      {
        type: "TEXT",
        name: "",
        required: false,
        options: undefined,
      },
    ]);
  };

  const handleUpdateField = (
    index: number,
    field: {
      type: "TEXT" | "SELECT" | "MULTI_SELECT";
      name: string;
      options?: string[];
      required: boolean;
    }
  ) => {
    setCustomFields((prev) => {
      const updated = [...prev];
      if (field.type === "SELECT" || field.type === "MULTI_SELECT") {
        field.options = field.options || [""];
      } else {
        field.options = undefined;
      }
      updated[index] = { ...updated[index], ...field };
      return updated;
    });
  };

  const handleRemoveField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  return (
    <form action={formAction}>
      <input type="hidden" name="journalId" value={journal.id} />
      <input type="hidden" name="fields" value={JSON.stringify(customFields)} />
      <Card className="w-2/3 mx-auto">
        <CardHeader>
          <CardTitle>Journal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-10">
          <div className="space-y-2">
            <Label htmlFor="name">Journal Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={journal.name}
              disabled={isPending}
              className={state?.errors?.name ? "border-red-500" : ""}
            />
            {state?.errors?.name && (
              <p className="text-sm text-red-500">{state.errors.name[0]}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={journal.description ?? ""}
              disabled={isPending}
            />
          </div>

          <DefaultFieldDisplay />

          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Custom Fields</h3>
              <p className="text-sm text-muted-foreground">
                Add your own fields to track specific data points for your
                trading strategy. These can be customized for each journal.
              </p>
            </div>

            {customFields.map((field, index) => (
              <CustomFieldForm
                key={field.id || index}
                field={{
                  type: field.type,
                  name: field.name,
                  options: field.options,
                  required: field.required,
                }}
                onUpdate={(updatedField) =>
                  handleUpdateField(index, updatedField)
                }
                onRemove={() => handleRemoveField(index)}
                disabled={isPending}
              />
            ))}
            <Button type="button" onClick={handleAddField} disabled={isPending}>
              <PlusIcon className="h-4 w-4 mr-2" />
              {customFields.length > 0 ? "Add another field" : "Add Field"}
            </Button>
          </div>

          {state?.message && (
            <Alert variant={state.success ? "default" : "destructive"}>
              {state.success && <CheckCircle2 className="h-4 w-4" />}
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

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
              {isPending ? "Updating..." : "Update Journal"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
