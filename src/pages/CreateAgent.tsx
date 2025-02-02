import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import LoadingFallback from "@/components/LoadingFallback";
import AgentFormFields from "@/components/AgentFormFields";
import AgentPreview from "@/components/AgentPreview";
import { useAuth } from "@/components/AuthProvider";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  files: z.array(z.object({
    path: z.string(),
    name: z.string()
  })).optional(),
  modelProvider: z.string(),
  lore: z.string().optional(),
  style: z.string(),
});

const CreateAgent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'creating' | 'deploying' | 'completed' | 'error'>('idle');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
      files: [],
      modelProvider: "openai",
      lore: "",
      style: "All",
    },
  });

  const nextStep = () => {
    const currentFields = getCurrentStepFields();
    const isValid = currentFields.every((field) => {
      const fieldState = form.getFieldState(field);
      return !fieldState.invalid;
    });

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 2));
    } else {
      form.trigger(currentFields);
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const getCurrentStepFields = () => {
    switch (currentStep) {
      case 0:
        return ["name", "bio", "files"];
      case 1:
        return ["modelProvider"];
      case 2:
        return ["lore", "style"];
      default:
        return [];
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
      
      // Create the agent with creator_id
      const { data: agentData, error: agentError } = await supabase
        .from("agents")
        .insert({
          name: values.name,
          status: "training",
          creator_id: user.id,
          configuration: {
            bio: values.bio,
            lore: values.lore,
            style: values.style,
          },
          ai_provider: values.modelProvider,
          system_prompt: values.lore || "",
        })
        .select()
        .single();

      if (agentError) throw agentError;
      if (!agentData) throw new Error("Failed to create agent");

      setDeploymentStatus('deploying');

      // If there are files, link them to the agent
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

      // Update agent status to active after successful deployment
      const { error: updateError } = await supabase
        .from("agents")
        .update({ status: "active" })
        .eq('id', agentData.id);

      if (updateError) throw updateError;

      setDeploymentStatus('completed');
      toast({
        title: "Success",
        description: "Your agent has been created and deployed successfully!",
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

  const getDeploymentStatusMessage = () => {
    switch (deploymentStatus) {
      case 'creating':
        return 'Creating agent...';
      case 'deploying':
        return 'Deploying agent...';
      case 'completed':
        return 'Agent deployed successfully!';
      case 'error':
        return 'Error deploying agent';
      default:
        return '';
    }
  };

  if (isSubmitting) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <LoadingFallback />
        <p className="mt-4 text-lg font-medium">{getDeploymentStatusMessage()}</p>
      </div>
    );
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
            <Form {...form}>
              <form className="space-y-6">
                <AgentFormFields form={form} currentStep={currentStep} />

                <div className="flex justify-between pt-4">
                  {currentStep > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={isSubmitting}
                    >
                      Previous
                    </Button>
                  )}
                  <div className="ml-auto">
                    {currentStep < 2 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={isSubmitting}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        onClick={() => form.handleSubmit(onSubmit)()}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Agent...
                          </>
                        ) : (
                          'Create Agent'
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <div className="max-w-2xl mx-auto">
            <AgentPreview formData={form.getValues()} />
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => form.handleSubmit(onSubmit)()}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Agent...
                  </>
                ) : (
                  'Create Agent'
                )}
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateAgent;