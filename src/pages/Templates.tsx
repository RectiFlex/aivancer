import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Bot, Brain, Bot as ChatBot, Zap } from "lucide-react";

const Templates = () => {
  const navigate = useNavigate();

  const templates = [
    {
      title: "Customer Support Agent",
      description: "AI agent optimized for handling customer inquiries and support tickets",
      icon: ChatBot,
      category: "Support",
    },
    {
      title: "Data Analysis Assistant",
      description: "Specialized in processing and analyzing large datasets",
      icon: Brain,
      category: "Analytics",
    },
    {
      title: "Task Automation Bot",
      description: "Automates repetitive tasks and workflow processes",
      icon: Zap,
      category: "Automation",
    },
    {
      title: "Custom Agent",
      description: "Start from scratch and build your own custom agent",
      icon: Bot,
      category: "Custom",
    },
  ];

  return (
    <div className="container mx-auto p-8 space-y-8 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Agent Templates</h1>
        <Button onClick={() => navigate("/create")} className="bg-primary">
          Create Custom Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => {
          const Icon = template.icon;
          return (
            <Card
              key={template.title}
              className="p-6 cursor-pointer hover:scale-105 transition-transform glass-card"
              onClick={() => navigate(`/create?template=${template.title.toLowerCase().replace(/\s+/g, '-')}`)}
            >
              <div className="flex items-center gap-4 mb-4">
                <Icon className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">{template.title}</h3>
                  <span className="text-sm text-muted-foreground">{template.category}</span>
                </div>
              </div>
              <p className="text-muted-foreground">{template.description}</p>
            </Card>
          )
        })}
      </div>
    </div>
  );
};

export default Templates;