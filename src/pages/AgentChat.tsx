import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { supabase } from "@/integrations/supabase/client";
import ChatUI from "@/components/ChatUI";
import LoadingFallback from "@/components/LoadingFallback";

const AgentChat = () => {
  const [searchParams] = useSearchParams();
  const agentId = searchParams.get("agent");

  // Get or create chat session
  const { data: session, isLoading } = useQuery({
    queryKey: ["chat-session", agentId],
    queryFn: async () => {
      if (!agentId) throw new Error("No agent ID provided");

      // Check for existing session
      const { data: existingSession } = await supabase
        .from("chat_sessions")
        .select("*")
        .eq("agent_id", agentId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (existingSession) return existingSession;

      // Create new session
      const { data: newSession, error } = await supabase
        .from("chat_sessions")
        .insert({
          agent_id: agentId,
          title: "New Chat",
        })
        .select()
        .single();

      if (error) throw error;
      return newSession;
    },
  });

  if (isLoading) return <LoadingFallback />;
  if (!session) return <div>Error: Could not create chat session</div>;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold">Chat</h1>
            </div>
            <ChatUI sessionId={session.id} />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AgentChat;