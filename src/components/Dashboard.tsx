
import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Users, Search, TrendingUp } from "lucide-react";
import HeroSection from "./HeroSection";
import SearchInterface from "./SearchInterface";
import FeaturesSection from "./FeaturesSection";

interface DashboardStats {
  totalCandidates: number;
  totalSearches: number;
  savedCandidates: number;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCandidates: 0,
    totalSearches: 0,
    savedCandidates: 0
  });
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user) return;

    try {
      const [candidatesResult, searchesResult, savedResult] = await Promise.all([
        supabase.from('candidates').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('searches').select('id', { count: 'exact' }).eq('user_id', user.id),
        supabase.from('saved_candidates').select('id', { count: 'exact' }).eq('user_id', user.id)
      ]);

      setStats({
        totalCandidates: candidatesResult.count || 0,
        totalSearches: searchesResult.count || 0,
        savedCandidates: savedResult.count || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearch(true);
    
    // Save search to database
    if (user && query.trim()) {
      supabase.from('searches').insert({
        user_id: user.id,
        query: query.trim(),
        results_count: 0
      }).then(() => {
        fetchStats(); // Refresh stats
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Hire Copilot
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-slate-600">
                Welcome, {user?.user_metadata?.full_name || user?.email}
              </span>
              <Button variant="outline" onClick={signOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Stats */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCandidates}</div>
                <p className="text-xs text-muted-foreground">
                  Candidates in your pipeline
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Searches</CardTitle>
                <Search className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSearches}</div>
                <p className="text-xs text-muted-foreground">
                  Total searches performed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saved Candidates</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.savedCandidates}</div>
                <p className="text-xs text-muted-foreground">
                  Candidates you've saved
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      {!showSearch ? (
        <>
          <HeroSection onSearch={handleSearch} />
          <FeaturesSection />
        </>
      ) : (
        <SearchInterface 
          query={searchQuery}
          onQueryChange={setSearchQuery}
          candidates={[]} // Will be populated with real data
        />
      )}
    </div>
  );
};

export default Dashboard;
