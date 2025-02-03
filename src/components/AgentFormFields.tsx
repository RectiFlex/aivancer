import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FileUploadField from "./FileUploadField";

interface AgentFormFieldsProps {
  form: UseFormReturn<any>;
  currentStep: number;
}

// Available options for dropdowns
const MODEL_PROVIDERS = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "google", label: "Google AI" }
];

const CHARACTER_MODELS = [
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "claude-2", label: "Claude 2" },
  { value: "gemini-pro", label: "Gemini Pro" }
];

const EMBEDDING_MODELS = [
  { value: "text-embedding-3-small", label: "Text Embedding 3 Small" },
  { value: "text-embedding-3-large", label: "Text Embedding 3 Large" },
  { value: "text-embedding-ada-002", label: "Text Embedding Ada 002" }
];

const VOICE_MODELS = [
  { value: "nova", label: "Nova" },
  { value: "echo", label: "Echo" },
  { value: "onyx", label: "Onyx" },
  { value: "shimmer", label: "Shimmer" }
];

const CLIENT_OPTIONS = [
  { value: "enterprise", label: "Enterprise" },
  { value: "startup", label: "Startup" },
  { value: "individual", label: "Individual" },
  { value: "agency", label: "Agency" }
];

const AgentFormFields = ({ form, currentStep }: AgentFormFieldsProps) => {
  if (currentStep === 0) {
    return (
      <>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter agent name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter agent bio"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="clients"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Clients</FormLabel>
              <Select 
                onValueChange={(value) => {
                  const clients = value.split(',');
                  field.onChange(clients);
                }}
                defaultValue={Array.isArray(field.value) ? field.value.join(',') : ''}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select client types" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CLIENT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    );
  }

  if (currentStep === 1) {
    return (
      <>
        <FormField
          control={form.control}
          name="modelProvider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Model Provider</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a model provider" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {MODEL_PROVIDERS.map((provider) => (
                    <SelectItem key={provider.value} value={provider.value}>
                      {provider.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="settings.model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Character Model</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a character model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CHARACTER_MODELS.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="settings.embeddingModel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Embedding Model</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an embedding model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {EMBEDDING_MODELS.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="settings.voice.model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voice Model</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a voice model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {VOICE_MODELS.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    );
  }

  if (currentStep === 2) {
    return (
      <>
        <FormField
          control={form.control}
          name="lore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lore/Background</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter agent's background story (one per line)"
                  className="min-h-[100px]"
                  {...field}
                  onChange={(e) => {
                    const lore = e.target.value.split('\n').filter(l => l.trim());
                    field.onChange(lore);
                  }}
                  value={Array.isArray(field.value) ? field.value.join('\n') : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="topics"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topics</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter topics (comma-separated)"
                  {...field}
                  onChange={(e) => {
                    const topics = e.target.value.split(',').map(t => t.trim());
                    field.onChange(topics);
                  }}
                  value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="adjectives"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Adjectives</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter adjectives (comma-separated)"
                  {...field}
                  onChange={(e) => {
                    const adjectives = e.target.value.split(',').map(a => a.trim());
                    field.onChange(adjectives);
                  }}
                  value={Array.isArray(field.value) ? field.value.join(', ') : ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    );
  }

  return null;
};

export default AgentFormFields;