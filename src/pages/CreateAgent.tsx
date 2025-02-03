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

type FormValues = z.infer<typeof formSchema>;

const CreateAgent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'creating' | 'deploying' | 'completed' | 'error'>('idle');

  const form = useForm<FormValues>({
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

  const getCurrentStepFields = () => {
    const fields: Array<keyof FormValues> = [];
    switch (currentStep) {
      case 0:
        fields.push("name", "bio", "files");
        break;
      case 1:
        fields.push("modelProvider");
        break;
      case 2:
        fields.push("lore", "style");
        break;
    }
    return fields;
  };

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

  const onSubmit = async (values: FormValues) => {
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
      
      // Create agent using Edge Function
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-agent`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          bio: values.bio,
          lore: values.lore,
          style: values.style,
          modelProvider: values.modelProvider,
        }),
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
                        onClick={form.handleSubmit(onSubmit)}
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
                onClick={form.handleSubmit(onSubmit)}
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
