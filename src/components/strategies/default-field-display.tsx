export function DefaultFieldDisplay() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Default Fields</h3>
        <p className="text-sm text-muted-foreground">
          These fields are included by default for all strategies and cannot be
          modified.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium">Trading Pair</h4>
          <p className="text-sm text-muted-foreground">
            The asset pair being traded
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium">Trade Status</h4>
          <p className="text-sm text-muted-foreground">
            Order Placed / Open / Closed
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium">Entry Date</h4>
          <p className="text-sm text-muted-foreground">
            When the trade was opened
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium">Exit Date</h4>
          <p className="text-sm text-muted-foreground">
            When the trade was closed
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium">Result</h4>
          <p className="text-sm text-muted-foreground">
            Win / Loss / Break Even
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium">P&L</h4>
          <p className="text-sm text-muted-foreground">Profit or loss amount</p>
        </div>
      </div>
    </div>
  );
}
