import { Upload, Code, Box } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { QuickStartCard } from "@/components/QuickStartCard";
import { SystemStatus } from "@/components/SystemStatus";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const handleQuickStart = (title: string) => {
    toast({
      title: "Coming Soon",
      description: `${title} feature will be available in the next update!`,
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <SidebarTrigger />
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