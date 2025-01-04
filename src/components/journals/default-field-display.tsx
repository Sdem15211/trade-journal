"use client";

import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function DefaultFieldDisplay() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Default Fields</h3>
        <p className="text-sm text-muted-foreground">
          These are standard fields included in every journal. They cannot be
          edited or removed.
        </p>
      </div>
      <div className="space-y-4">
        {/* Pair Field */}
        <div className="space-y-2">
          <Label>Pair</Label>
          <Input placeholder="Fill in the pair" disabled />
        </div>

        {/* Date Fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Open date</Label>
            <DatePicker disabled />
          </div>
          <div className="space-y-2">
            <Label>Close date</Label>
            <DatePicker disabled />
          </div>
        </div>

        {/* Result and P&L Fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Result</Label>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WIN">Win</SelectItem>
                <SelectItem value="LOSS">Loss</SelectItem>
                <SelectItem value="BREAKEVEN">Break-even</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>P&L</Label>
            <div className="relative">
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                disabled
                className="pr-6"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                %
              </span>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Notes (optional)</Label>
          </div>
          <Textarea disabled placeholder="notes" className="resize-none" />
        </div>
      </div>
    </div>
  );
}
