import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface QuickStartCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export function QuickStartCard({ title, description, icon: Icon, onClick }: QuickStartCardProps) {
  return (
    <Card 
      className="glass-card p-6 cursor-pointer transition-all hover:scale-105 hover:bg-black/50"
      onClick={onClick}
    >
      <Icon className="h-8 w-8 mb-4 text-primary" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}