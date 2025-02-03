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

const CLIENT_OPTIONS = [
  { value: "enterprise", label: "Enterprise" },
  { value: "startup", label: "Startup" },
  { value: "individual", label: "Individual" },
  { value: "agency", label: "Agency" }
];

interface BasicInfoFieldsProps {
  form: UseFormReturn<any>;
}

const BasicInfoFields = ({ form }: BasicInfoFieldsProps) => {
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
};

export default BasicInfoFields;