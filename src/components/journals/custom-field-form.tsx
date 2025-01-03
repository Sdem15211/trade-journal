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
import { Plus, X } from "lucide-react";

interface CustomField {
  name: string;
  type: "TEXT" | "SELECT" | "MULTI_SELECT";
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
  const handleAddOption = () => {
    onUpdate({
      ...field,
      options: [...(field.options || []), ""],
    });
  };

  const handleRemoveOption = (index: number) => {
    onUpdate({
      ...field,
      options: field.options?.filter((_, i) => i !== index),
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    onUpdate({
      ...field,
      options: field.options?.map((opt, i) => (i === index ? value : opt)),
    });
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
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TEXT">Text Input</SelectItem>
              <SelectItem value="SELECT">Single Select</SelectItem>
              <SelectItem value="MULTI_SELECT">Multi Select</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(field.type === "SELECT" || field.type === "MULTI_SELECT") && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Options</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddOption}
                disabled={disabled}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Option
              </Button>
            </div>
            <div className="space-y-2">
              {field.options?.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    disabled={disabled}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                    disabled={disabled}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {(!field.options || field.options.length === 0) && (
                <p className="text-sm text-muted-foreground">
                  Add options for your field
                </p>
              )}
            </div>
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
