import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AgentPreviewProps {
  formData: any;
}

const AgentPreview = ({ formData }: AgentPreviewProps) => {
  // Ensure formData exists, if not return empty state
  if (!formData) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground">No preview data available</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold">{formData.name || 'Unnamed Agent'}</h2>
            <p className="text-muted-foreground mt-2">{formData.bio || 'No bio provided'}</p>
          </div>
          {formData.modelProvider && (
            <Badge>{formData.modelProvider}</Badge>
          )}
        </div>
        
        {Array.isArray(formData.clients) && formData.clients.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Clients</h3>
            <div className="flex gap-2 flex-wrap">
              {formData.clients.map((client: string, index: number) => (
                <Badge key={index} variant="outline">{client}</Badge>
              ))}
            </div>
          </div>
        )}

        {formData.settings && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Model Settings</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Character Model: {formData.settings?.model || 'Not specified'}</p>
              <p>Embedding Model: {formData.settings?.embeddingModel || 'Not specified'}</p>
              <p>Voice Model: {formData.settings?.voice?.model || 'Not specified'}</p>
            </div>
          </div>
        )}
        
        {Array.isArray(formData.lore) && formData.lore.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Background Story</h3>
            <ul className="list-disc pl-4 space-y-2 text-muted-foreground">
              {formData.lore.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {(Array.isArray(formData.topics) && formData.topics.length > 0) || 
         (Array.isArray(formData.adjectives) && formData.adjectives.length > 0) && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Characteristics</h3>
            {Array.isArray(formData.topics) && formData.topics.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Topics</h4>
                <div className="flex gap-2 flex-wrap">
                  {formData.topics.map((topic: string, index: number) => (
                    <Badge key={index} variant="secondary">{topic}</Badge>
                  ))}
                </div>
              </div>
            )}
            {Array.isArray(formData.adjectives) && formData.adjectives.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Adjectives</h4>
                <div className="flex gap-2 flex-wrap">
                  {formData.adjectives.map((adj: string, index: number) => (
                    <Badge key={index} variant="outline">{adj}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default AgentPreview;