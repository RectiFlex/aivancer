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

interface PersonalityFieldsProps {
  form: UseFormReturn<any>;
}

const PersonalityFields = ({ form }: PersonalityFieldsProps) => {
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
};

export default PersonalityFields;