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
        
        {/* Add other configuration fields */}
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
                  placeholder="Enter agent's background story"
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
          name="style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Communication Style</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Chat">Chat</SelectItem>
                  <SelectItem value="Post">Post</SelectItem>
                </SelectContent>
              </Select>
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