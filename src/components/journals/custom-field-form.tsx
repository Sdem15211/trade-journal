"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";

interface CustomField {
  name: string;
  type: "TEXT" | "SELECT" | "MULTI_SELECT" | "RADIO";
  required: boolean;
  options?: string[];
}

interface Props {
  field: CustomField;
  onUpdate: (field: CustomField) => void;
  onRemove: () => void;
  disabled?: boolean;
}

export function CustomFieldForm({
  field,
  onUpdate,
  onRemove,
  disabled,
}: Props) {
  const handleOptionsChange = (value: string) => {
    // Split by newline and filter out empty lines
    const options = value
      .split("\n")
      .map((opt) => opt.trim())
      .filter(Boolean);
    onUpdate({ ...field, options });
  };

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Label>Field Name</Label>
            <Input
              value={field.name}
              onChange={(e) => onUpdate({ ...field, name: e.target.value })}
              placeholder="Enter field name"
              disabled={disabled}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-2"
            onClick={onRemove}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Field Type</Label>
          <Select
            value={field.type}
            onValueChange={(value: CustomField["type"]) =>
              onUpdate({ ...field, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TEXT">Text Input</SelectItem>
              <SelectItem value="SELECT">Single Select</SelectItem>
              <SelectItem value="MULTI_SELECT">Multi Select</SelectItem>
              <SelectItem value="RADIO">Radio Buttons</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(field.type === "SELECT" ||
          field.type === "MULTI_SELECT" ||
          field.type === "RADIO") && (
          <div className="space-y-2">
            <Label>Options (one per line)</Label>
            <Textarea
              value={field.options?.join("\n") || ""}
              onChange={(e) => handleOptionsChange(e.target.value)}
              placeholder="Enter options..."
              rows={4}
              disabled={disabled}
            />
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Switch
            id={`required-${field.name}`}
            checked={field.required}
            onCheckedChange={(checked) =>
              onUpdate({ ...field, required: checked })
            }
            disabled={disabled}
          />
          <Label htmlFor={`required-${field.name}`}>Required field</Label>
        </div>
      </CardContent>
    </Card>
  );
}
