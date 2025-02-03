import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

interface ModelFieldsProps {
  form: UseFormReturn<any>;
}

const ModelFields = ({ form }: ModelFieldsProps) => {
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
};

export default ModelFields;