"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MultiSelectProps {
  options: string[];
  name: string;
  disabled?: boolean;
  defaultValue?: string[];
}

export function MultiSelect({
  options,
  name,
  disabled,
  defaultValue = [],
}: MultiSelectProps) {
  const [selectedOptions, setSelectedOptions] =
    useState<string[]>(defaultValue);
  const [open, setOpen] = useState(false);

  const handleSelect = (option: string) => {
    if (!selectedOptions.includes(option)) {
      setSelectedOptions([...selectedOptions, option]);
    } else {
      handleRemove(option);
    }
  };

  const handleRemove = (option: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedOptions(selectedOptions.filter((item) => item !== option));
  };

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between bg-slate-100 h-auto",
              selectedOptions.length > 0 && "h-auto py-2"
            )}
            disabled={disabled}
          >
            <div className="flex flex-wrap gap-2">
              {selectedOptions.length > 0 ? (
                selectedOptions.map((option) => (
                  <Badge
                    key={option}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {option}
                    <span
                      role="button"
                      onClick={(e) => handleRemove(option, e)}
                      className="ml-1 cursor-pointer rounded-sm text-sm hover:text-destructive disabled:cursor-not-allowed"
                      aria-disabled={disabled}
                    >
                      <X className="size-2" />
                    </span>
                  </Badge>
                ))
              ) : (
                <span className="font-normal">Select</span>
              )}
            </div>
            <ChevronDown
              className={cn(
                "ml-2 h-4 w-4 shrink-0 opacity-50",
                open && "rotate-180 transition-transform"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          style={{ width: "var(--radix-popover-trigger-width)" }}
          align="start"
        >
          <div className="flex flex-wrap gap-2 p-4">
            {options.map((option) => (
              <Badge
                key={option}
                variant={
                  selectedOptions.includes(option) ? "secondary" : "outline"
                }
                className={cn(
                  "cursor-pointer hover:bg-secondary transition-colors",
                  selectedOptions.includes(option) && "bg-secondary",
                  !selectedOptions.includes(option) &&
                    "bg-background hover:text-secondary-foreground"
                )}
                onClick={() => handleSelect(option)}
              >
                {option}
              </Badge>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <input type="hidden" name={name} value={selectedOptions.join(",")} />
    </div>
  );
}
