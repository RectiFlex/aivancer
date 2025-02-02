import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAgentUpdates } from "@/hooks/useAgentUpdates";
import LoadingFallback from "@/components/LoadingFallback";
import { QuickStartCard } from "@/components/QuickStartCard";
import { SystemStatus } from "@/components/SystemStatus";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const navigate = useNavigate();

  const { data: agents, isLoading } = useQuery({
    queryKey: ['agents', refreshTrigger],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  useAgentUpdates(() => {
    setRefreshTrigger(prev => prev + 1);
  });

  if (isLoading) {
    return <LoadingFallback />;
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuickStartCard 
            title="Create New Agent"
            description="Start building your custom AI agent with our intuitive creation wizard"
            icon={PlusCircle}
            onClick={() => navigate('/create')}
          />
          <SystemStatus />
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Agents</h2>
          {agents && agents.length > 0 ? (
            <div className="space-y-4">
              {agents.map((agent) => (
                <Card key={agent.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{agent.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {agent.description || 'No description'}
                      </p>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(agent.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No agents created yet</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Index;