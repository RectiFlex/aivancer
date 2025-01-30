import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AgentPreviewProps {
  formData: any;
}

const AgentPreview = ({ formData }: AgentPreviewProps) => {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{formData.name}</h2>
            <p className="text-muted-foreground mt-2">{formData.bio}</p>
          </div>
          <Badge>{formData.style}</Badge>
        </div>
        
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Model Provider</h3>
          <p className="text-muted-foreground">{formData.modelProvider}</p>
        </div>
        
        {formData.lore && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Background Story</h3>
            <p className="text-muted-foreground">{formData.lore}</p>
          </div>
        )}
      </Card>
      
      <div className="text-sm text-muted-foreground text-center">
        This is a preview of how your agent will appear. You can go back to edit mode to make changes.
      </div>
    </div>
  );
};

export default AgentPreview;