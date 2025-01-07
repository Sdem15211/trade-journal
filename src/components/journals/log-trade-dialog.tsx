"use client";

import * as React from "react";
import { CalendarIcon, CheckCircle2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { createTrade } from "@/app/(server)/actions/trade";
import { useActionState } from "react";
import type { Journal, JournalField } from "@prisma/client";
import type { TradeActionResponse } from "@/app/(server)/actions/trade";
import { Alert, AlertDescription } from "../ui/alert";
import { MultiSelect } from "../ui/multi-select";

interface LogTradeDialogProps {
  journal: Journal & {
    fields: JournalField[];
  };
}

const initialState: TradeActionResponse = {
  success: false,
  message: "",
};

export function LogTradeDialog({ journal }: LogTradeDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(
    createTrade,
    initialState
  );
  const [openDate, setOpenDate] = React.useState<Date>();
  const [closeDate, setCloseDate] = React.useState<Date>();

  React.useEffect(() => {
    if (state?.message) {
      toast({
        title: state.success ? "Success" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });

      if (state.success) {
        setOpen(false);
        setOpenDate(undefined);
        setCloseDate(undefined);
      }
    }
  }, [state, toast]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          Log trade <Plus className="h-4 w-4 ml-1" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Log trade</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Fill in input fields to log your trade.
          </p>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="journalId" value={journal.id} />
          <input
            type="hidden"
            name="openDate"
            value={openDate?.toISOString() ?? ""}
          />
          <input
            type="hidden"
            name="closeDate"
            value={closeDate?.toISOString() ?? ""}
          />

          <div className="space-y-2">
            <Label htmlFor="pair">Pair</Label>
            <Input
              id="pair"
              name="pair"
              placeholder="Fill in the pair"
              disabled={isPending}
              className={state?.errors?.pair ? "border-destructive" : ""}
            />
            {state?.errors?.pair && (
              <p className="text-sm text-red-500">{state.errors.pair[0]}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Open date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal bg-slate-100",
                      !openDate && "text-muted-foreground"
                    )}
                    disabled={isPending}
                  >
                    {openDate ? (
                      format(openDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={openDate}
                    onSelect={setOpenDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Close date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full pl-3 text-left font-normal bg-slate-100",
                      !closeDate && "text-muted-foreground"
                    )}
                    disabled={isPending}
                  >
                    {closeDate ? (
                      format(closeDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={closeDate}
                    onSelect={setCloseDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="result">Result</Label>
              <Select name="result" defaultValue="WIN" disabled={isPending}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WIN">
                    <span className="inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-bold text-green-900 bg-green-200">
                      Win
                    </span>
                  </SelectItem>
                  <SelectItem value="LOSS">
                    <span className="inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-bold text-red-900 bg-red-200">
                      Loss
                    </span>
                  </SelectItem>
                  <SelectItem value="BREAKEVEN">
                    <span className="inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-bold text-slate-900 bg-slate-200">
                      BE
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pnl">P&L</Label>
              <div className="relative">
                <Input
                  id="pnl"
                  name="pnl"
                  type="number"
                  step="0.01"
                  defaultValue="0"
                  className="pr-6"
                  disabled={isPending}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  %
                </span>
              </div>
            </div>
          </div>

          {/* Custom fields */}
          {journal.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <Label htmlFor={`fields.${field.name}`}>{field.name}</Label>
              {field.type === "TEXT" ? (
                <Input
                  id={`fields.${field.name}`}
                  name={`fields.${field.name}`}
                  disabled={isPending}
                />
              ) : field.type === "SELECT" ? (
                <Select name={`fields.${field.name}`} disabled={isPending}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === "MULTI_SELECT" ? (
                <MultiSelect
                  name={`fields.${field.name}`}
                  options={field.options ?? []}
                  disabled={isPending}
                />
              ) : null}
            </div>
          ))}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="notes"
              className="resize-none"
              disabled={isPending}
            />
          </div>

          {state?.message && !state.success && (
            <Alert variant="destructive">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Logging..." : "Log"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
