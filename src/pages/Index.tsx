import { Upload, Code, Box } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { QuickStartCard } from "@/components/QuickStartCard";
import { SystemStatus } from "@/components/SystemStatus";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const quickStartOptions = [
  {
    title: "Upload Configuration",
    description: "Import an existing agent configuration file",
    icon: Upload,
  },
  {
    title: "Build from Scratch",
    description: "Create a new agent with our step-by-step wizard",
    icon: Code,
  },
  {
    title: "Use Template",
    description: "Start with pre-built agent templates",
    icon: Box,
  },
];

const Index = () => {
  const navigate = useNavigate();

  const handleQuickStart = (title: string) => {
    switch (title) {
      case "Upload Configuration":
        navigate("/create");
        break;
      case "Build from Scratch":
        navigate("/create");
        break;
      case "Use Template":
        navigate("/templates");
        break;
      default:
        break;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold">Welcome to Autonomous</h1>
              <SystemStatus />
            </div>
            
            <section>
              <h2 className="text-2xl font-semibold mb-4">Quick Start</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickStartOptions.map((option) => (
                  <QuickStartCard
                    key={option.title}
                    {...option}
                    onClick={() => handleQuickStart(option.title)}
                  />
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Recent Agents</h2>
              <Card className="glass-card p-6">
                <p className="text-muted-foreground">No agents created yet. Start by creating your first agent!</p>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;