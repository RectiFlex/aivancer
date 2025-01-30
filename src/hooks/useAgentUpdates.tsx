import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAgentUpdates = (onUpdate?: () => void) => {
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel('agent-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'agents'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          toast({
            title: 'Agent Updated',
            description: `An agent was ${payload.eventType}d`
          });
          if (onUpdate) {
            onUpdate();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onUpdate, toast]);
};