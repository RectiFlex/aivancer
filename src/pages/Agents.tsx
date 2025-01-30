import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

type Agent = {
  id: string;
  name: string;
  description: string | null;
  status: "draft" | "active" | "archived" | "training";
  created_at: string;
};

const Agents = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAgents(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAgent = async (id: string) => {
    try {
      const { error } = await supabase.from("agents").delete().eq("id", id);
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Agent deleted successfully",
      });
      
      setAgents(agents.filter(agent => agent.id !== id));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: Agent["status"]) => {
    switch (status) {
      case "active":
        return "text-green-500";
      case "draft":
        return "text-yellow-500";
      case "archived":
        return "text-gray-500";
      case "training":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="container mx-auto p-8 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">My Agents</h1>
        <Button onClick={() => navigate("/create")} className="bg-primary">
          <Plus className="mr-2 h-4 w-4" /> New Agent
        </Button>
      </div>

      {loading ? (
        <Card className="p-6">
          <p className="text-muted-foreground">Loading agents...</p>
        </Card>
      ) : agents.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground">No agents created yet. Start by creating your first agent!</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Card key={agent.id} className="p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{agent.name}</h3>
                  <p className="text-sm text-muted-foreground">{agent.description || "No description"}</p>
                </div>
                <span className={`text-sm font-medium ${getStatusColor(agent.status)}`}>
                  {agent.status}
                </span>
              </div>
              
              <div className="flex gap-2 mt-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/agents/${agent.id}/edit`)}
                >
                  <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Agent</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this agent? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteAgent(agent.id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Agents;