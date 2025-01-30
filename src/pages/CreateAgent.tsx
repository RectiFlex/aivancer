import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  modelProvider: z.string(),
  clients: z.array(z.string()),
  plugins: z.array(z.string()),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  lore: z.string(),
  messageExamples: z.string(),
  postExamples: z.string(),
  style: z.enum(["All", "Chat", "Post"]),
  topics: z.string(),
  adjectives: z.string(),
});

const CreateAgent = () => {
  const [searchParams] = useSearchParams();
  const template = searchParams.get("template");
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      modelProvider: "",
      clients: [],
      plugins: [],
      bio: "",
      lore: "",
      messageExamples: "",
      postExamples: "",
      style: "All",
      topics: "",
      adjectives: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Here you would typically send the data to your backend
      console.log("Form values:", values);
      
      toast({
        title: "Agent Created",
        description: "Your agent has been created successfully!",
      });
      navigate("/agents");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create agent. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-8 animate-fadeIn">
      <Card className="max-w-2xl mx-auto p-6 glass-card">
        <h1 className="text-3xl font-bold mb-6">
          {template
            ? `Create ${template.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}`
            : "Create New Agent"}
        </h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              name="clients"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clients</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange([...field.value, value])}
                    defaultValue={field.value[0]}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select clients" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="x">X (Twitter)</SelectItem>
                      <SelectItem value="discord">Discord</SelectItem>
                      <SelectItem value="telegram">Telegram</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plugins"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plugins</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange([...field.value, value])}
                    defaultValue={field.value[0]}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select plugins" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="search">Web Search</SelectItem>
                      <SelectItem value="calculator">Calculator</SelectItem>
                      <SelectItem value="weather">Weather</SelectItem>
                    </SelectContent>
                  </Select>
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
              name="lore"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lore</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter agent lore/background story"
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
              name="messageExamples"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Examples</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter example messages"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add example messages to establish interaction patterns
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postExamples"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Post Examples</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter example posts"
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
                  <FormLabel>Style</FormLabel>
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">Create Agent</Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default CreateAgent;