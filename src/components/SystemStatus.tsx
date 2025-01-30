import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export function SystemStatus() {
  return (
    <Card className="glass-card p-4">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <span className="text-sm">All Systems Operational</span>
      </div>
    </Card>
  );
}