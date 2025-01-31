import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { supabase } from "@/integrations/supabase/client";
import ChatUI from "@/components/ChatUI";
import LoadingFallback from "@/components/LoadingFallback";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/components/AuthProvider";

const AgentChat = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const agentId = searchParams.get("agent");
  const { user } = useAuth();
  const [selectedAgentId, setSelectedAgentId] = useState(agentId);

  // Fetch available agents
  const { data: agents, isLoading: loadingAgents } = useQuery({
    queryKey: ["available-agents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agents")
        .select("id, name")
        .eq("status", "active")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  // Get or create chat session
  const { data: session, isLoading: loadingSession } = useQuery({
    queryKey: ["chat-session", selectedAgentId],
    queryFn: async () => {
      if (!selectedAgentId) return null;

      // Check for existing session
      const { data: existingSession } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("agent_id", selectedAgentId)
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (existingSession) return existingSession;

      // Create new session
      const { data: newSession, error } = await supabase
        .from("chat_sessions")
        .insert({
          agent_id: selectedAgentId,
          user_id: user?.id,
          title: "New Chat",
        })
        .select()
        .single();

      if (error) throw error;
      return newSession;
    },
    enabled: !!selectedAgentId && !!user,
  });

  // Update URL when agent changes
  useEffect(() => {
    if (selectedAgentId) {
      setSearchParams({ agent: selectedAgentId });
    }
  }, [selectedAgentId, setSearchParams]);

  if (loadingAgents) return <LoadingFallback />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-bold">Chat</h1>
              <Select
                value={selectedAgentId || ""}
                onValueChange={setSelectedAgentId}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agents?.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      {agent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedAgentId && session ? (
              <ChatUI sessionId={session.id} />
            ) : (
              <div className="text-center text-muted-foreground">
                Please select an agent to start chatting
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AgentChat;