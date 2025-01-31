import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import ProgressSteps from "@/components/ProgressSteps";
import LoadingFallback from "@/components/LoadingFallback";
import AgentFormFields from "@/components/AgentFormFields";
import AgentPreview from "@/components/AgentPreview";
import { useAuth } from "@/components/AuthProvider";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  modelProvider: z.string(),
  lore: z.string().optional(),
  style: z.enum(["All", "Chat", "Post"]),
  files: z.array(z.object({
    path: z.string(),
    name: z.string()
  })).optional()
});

const steps = [
  {
    title: "Basic Information",
    description: "Enter the agent's name and basic details",
  },
  {
    title: "Configuration",
    description: "Set up model provider and integrations",
  },
  {
    title: "Personality",
    description: "Define the agent's character and behavior",
  },
  {
    title: "Preview",
    description: "Review your agent",
  },
];

const CreateAgent = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const template = searchParams.get("template");
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
      modelProvider: "",
      lore: "",
      style: "All",
      files: []
    },
  });

  const saveDraft = async () => {
    try {
      const values = form.getValues();
      const { error } = await supabase.from("agents").insert({
        name: values.name,
        status: "draft",
        creator_id: user?.id,
        configuration: {
          bio: values.bio,
          modelProvider: values.modelProvider,
          lore: values.lore,
          style: values.style,
          files: values.files
        },
      });

      if (error) throw error;

      toast({
        title: "Draft Saved",
        description: "Your agent has been saved as a draft.",
      });

      navigate("/agents");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Create the agent with creator_id
      const { data: agent, error: agentError } = await supabase
        .from("agents")
        .insert({
          name: values.name,
          status: "active",
          creator_id: user?.id,
          configuration: {
            bio: values.bio,
            modelProvider: values.modelProvider,
            lore: values.lore,
            style: values.style,
            files: values.files
          },
        })
        .select()
        .single();

      if (agentError) throw agentError;

      // If there are files, link them to the agent
      if (values.files && values.files.length > 0) {
        const { error: filesError } = await supabase
          .from("agent_files")
          .insert(
            values.files.map(file => ({
              agent_id: agent.id,
              creator_id: user?.id,
              file_name: file.name,
              file_path: file.path,
            }))
          );

        if (filesError) throw filesError;
      }

      toast({
        title: "Success",
        description: "Your agent has been created successfully!",
      });
      
      navigate("/agents");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return <LoadingFallback />;
  }

  return (
    <div className="container mx-auto p-8 animate-fadeIn">
      <Card className="max-w-4xl mx-auto p-6 glass-card">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">
              {template
                ? `Create ${template.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}`
                : "Create New Agent"}
            </h1>
            <p className="text-muted-foreground mt-2">
              Follow the steps below to create your agent
            </p>
          </div>
          <ProgressSteps steps={steps} currentStep={currentStep} />
        </div>

        <Tabs
          defaultValue="edit"
          value={previewMode ? "preview" : "edit"}
          onValueChange={(value) => setPreviewMode(value === "preview")}
          className="w-full"
        >
          <TabsList className="mb-6">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="edit">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <AgentFormFields form={form} currentStep={currentStep} />
                
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={saveDraft}
                    disabled={isSubmitting}
                  >
                    Save as Draft
                  </Button>
                  
                  <div className="space-x-4">
                    {currentStep > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(currentStep - 1)}
                      >
                        Previous
                      </Button>
                    )}
                    
                    {currentStep < steps.length - 1 ? (
                      <Button
                        type="button"
                        onClick={() => setCurrentStep(currentStep + 1)}
                      >
                        Next
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        onClick={() => form.handleSubmit(onSubmit)()}
                      >
                        Create Agent
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="preview">
            <AgentPreview formData={form.getValues()} />
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => form.handleSubmit(onSubmit)()}
                disabled={isSubmitting}
              >
                Create Agent
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default CreateAgent;