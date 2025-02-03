import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import AgentPreview from "@/components/AgentPreview";
import CreateAgentForm, { FormValues } from "@/components/create-agent/CreateAgentForm";
import DeploymentStatus from "@/components/create-agent/DeploymentStatus";

const CreateAgent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'creating' | 'deploying' | 'completed' | 'error'>('idle');
  const [formData, setFormData] = useState<FormValues | null>(null);

  const handleSubmit = async (values: FormValues) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to create an agent",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setDeploymentStatus('creating');
      setFormData(values);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-agent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create agent');
      }

      const { agent: agentData } = await response.json();

      setDeploymentStatus('deploying');

      if (values.files && values.files.length > 0) {
        const { error: filesError } = await supabase
          .from("agent_files")
          .insert(
            values.files.map((file) => ({
              agent_id: agentData.id,
              creator_id: user.id,
              file_name: file.name,
              file_path: file.path,
            }))
          );

        if (filesError) throw filesError;
      }

      setDeploymentStatus('completed');
      toast({
        title: "Success",
        description: "Your agent has been created successfully!",
      });
      
      navigate("/agents");
    } catch (error: any) {
      setDeploymentStatus('error');
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 2));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  if (isSubmitting) {
    return <DeploymentStatus status={deploymentStatus} />;
  }

  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="edit" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Create Agent</h1>
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit">
          <div className="max-w-2xl mx-auto">
            <CreateAgentForm
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              currentStep={currentStep}
              onNextStep={handleNextStep}
              onPrevStep={handlePrevStep}
            />
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <div className="max-w-2xl mx-auto">
            <AgentPreview formData={formData} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateAgent;