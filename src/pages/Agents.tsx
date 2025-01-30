import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

const Agents = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-8 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">My Agents</h1>
        <Button onClick={() => navigate("/templates")} className="bg-primary">
          <Plus className="mr-2 h-4 w-4" /> New Agent
        </Button>
      </div>

      <Card className="p-6 glass-card">
        <p className="text-muted-foreground">No agents created yet. Start by creating your first agent!</p>
      </Card>
    </div>
  );
};

export default Agents;