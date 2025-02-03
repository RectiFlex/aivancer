import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import AgentFormFields from "@/components/AgentFormFields";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  files: z.array(z.object({
    path: z.string(),
    name: z.string()
  })).optional(),
  modelProvider: z.string(),
  settings: z.object({
    model: z.string(),
    embeddingModel: z.string(),
    voice: z.object({
      model: z.string()
    }).optional()
  }).optional(),
  lore: z.array(z.string()).optional(),
  topics: z.array(z.string()).optional(),
  adjectives: z.array(z.string()).optional(),
  clients: z.array(z.string()).optional(),
});

export type FormValues = z.infer<typeof formSchema>;

interface CreateAgentFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
  isSubmitting: boolean;
  currentStep: number;
  onNextStep: () => void;
  onPrevStep: () => void;
}

const CreateAgentForm = ({
  onSubmit,
  isSubmitting,
  currentStep,
  onNextStep,
  onPrevStep,
}: CreateAgentFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      bio: "",
      files: [],
      modelProvider: "openai",
      settings: {
        model: "gpt-4o",
        embeddingModel: "text-embedding-3-small",
        voice: {
          model: "nova"
        }
      },
      lore: [],
      topics: [],
      adjectives: [],
      clients: [],
    },
  });

  return (
    <Form {...form}>
      <form className="space-y-6">
        <AgentFormFields form={form} currentStep={currentStep} />

        <div className="flex justify-between pt-4">
          {currentStep > 0 && (
            <Button
              type="button"
              variant="outline"
              onClick={onPrevStep}
              disabled={isSubmitting}
            >
              Previous
            </Button>
          )}
          <div className="ml-auto">
            {currentStep < 2 ? (
              <Button
                type="button"
                onClick={onNextStep}
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
  );
};

export default CreateAgentForm;