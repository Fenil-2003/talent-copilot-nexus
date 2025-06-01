
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface Candidate {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  score: number;
  skills: string[];
  experience_years: number;
  experience: string; // Add this property
  education: string;
  avatar?: string;
  highlights?: string[];
  email?: string;
  status: string;
  notes?: string;
}

export const useCandidates = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCandidates = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedCandidates: Candidate[] = data.map(candidate => ({
        ...candidate,
        skills: candidate.skills || [],
        experience: `${candidate.experience_years || 0} years`,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${candidate.name}`,
        highlights: [
          `${candidate.experience_years || 0}+ years of experience`,
          `Currently at ${candidate.company || 'Unknown Company'}`
        ]
      }));

      setCandidates(formattedCandidates);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchCandidates = async (query: string) => {
    if (!user || !query.trim()) return;

    setLoading(true);
    try {
      // Call our AI search edge function
      const { data, error } = await supabase.functions.invoke('ai-candidate-search', {
        body: { query, userId: user.id }
      });

      if (error) throw error;

      // Refresh candidates list
      fetchCandidates();
    } catch (error) {
      console.error('Error searching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();

    // Set up real-time listener for candidates
    const channel = supabase
      .channel('candidates-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'candidates',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          fetchCandidates();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return {
    candidates,
    loading,
    fetchCandidates,
    searchCandidates
  };
};
