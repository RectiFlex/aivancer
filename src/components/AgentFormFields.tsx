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
              <FormControl>
                <Input 
                  placeholder="Enter clients (comma-separated)"
                  {...field}
                  onChange={(e) => {
                    const clients = e.target.value.split(',').map(c => c.trim());
                    field.onChange(clients);
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
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="google">Google AI</SelectItem>
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
              <Input placeholder="Enter character model" {...field} />
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
              <Input placeholder="Enter embedding model" {...field} />
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
              <Input placeholder="Enter voice model" {...field} />
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