import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type SystemCheck = {
  name: string;
  status: "operational" | "degraded" | "down" | "loading";
  details?: string;
};

const useSystemChecks = () => {
  const { data: dbStatus } = useQuery({
    queryKey: ["system-db-status"],
    queryFn: async () => {
      try {
        const start = Date.now();
        const { data } = await supabase.from("agents").select("count(*)");
        const latency = Date.now() - start;
        return {
          name: "Database Connection",
          status: latency < 1000 ? "operational" : "degraded",
          details: `Latency: ${latency}ms`,
        } as SystemCheck;
      } catch (error) {
        return {
          name: "Database Connection",
          status: "down",
          details: "Unable to connect",
        } as SystemCheck;
      }
    },
    refetchInterval: 30000, // Check every 30 seconds
  });

  const { data: agentStatus } = useQuery({
    queryKey: ["system-agent-status"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("agents")
          .select("status")
          .eq("status", "active")
          .limit(1);

        return {
          name: "Agent System",
          status: data && data.length > 0 ? "operational" : "degraded",
          details: data && data.length > 0 ? "Agents available" : "No active agents",
        } as SystemCheck;
      } catch (error) {
        return {
          name: "Agent System",
          status: "down",
          details: "System unreachable",
        } as SystemCheck;
      }
    },
    refetchInterval: 30000,
  });

  return [
    dbStatus || { name: "Database Connection", status: "loading" },
    agentStatus || { name: "Agent System", status: "loading" },
  ];
};

const StatusIcon = ({ status }: { status: SystemCheck["status"] }) => {
  switch (status) {
    case "operational":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "degraded":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case "down":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "loading":
      return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
  }
};

export function SystemStatus() {
  const checks = useSystemChecks();

  return (
    <Card className="glass-card p-4">
      <div className="space-y-2">
        {checks.map((check) => (
          <div key={check.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <StatusIcon status={check.status} />
              <span className="text-sm font-medium">{check.name}</span>
            </div>
            {check.details && (
              <span className="text-xs text-muted-foreground">{check.details}</span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}