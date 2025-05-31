
import { useState } from "react";
import { Search, Users, Zap, BarChart3, MessageSquare, Shield, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import HeroSection from "@/components/HeroSection";
import SearchInterface from "@/components/SearchInterface";
import CandidateCard from "@/components/CandidateCard";
import DashboardSection from "@/components/DashboardSection";
import FeaturesSection from "@/components/FeaturesSection";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

  const mockCandidates = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "Senior Frontend Developer",
      company: "Google",
      location: "San Francisco, CA",
      score: 96,
      skills: ["React", "TypeScript", "Node.js", "GraphQL"],
      experience: "5 years",
      education: "Stanford University - CS",
      avatar: "/placeholder.svg",
      highlights: ["Led team of 8 developers", "Built scalable React applications", "Expert in modern web technologies"]
    },
    {
      id: 2,
      name: "Marcus Johnson",
      title: "Full Stack Engineer",
      company: "Microsoft",
      location: "Seattle, WA",
      score: 92,
      skills: ["Python", "React", "AWS", "Docker"],
      experience: "4 years",
      education: "MIT - Computer Science",
      avatar: "/placeholder.svg",
      highlights: ["Cloud architecture expert", "DevOps experience", "Open source contributor"]
    },
    {
      id: 3,
      name: "Elena Rodriguez",
      title: "AI/ML Engineer",
      company: "OpenAI",
      location: "Remote",
      score: 94,
      skills: ["Python", "TensorFlow", "PyTorch", "MLOps"],
      experience: "6 years",
      education: "Carnegie Mellon - AI",
      avatar: "/placeholder.svg",
      highlights: ["Published 12 research papers", "Built production ML systems", "PhD in Artificial Intelligence"]
    }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="relative">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  TalentCopilot
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost">Features</Button>
                <Button variant="ghost">Pricing</Button>
                <Button variant="ghost">About</Button>
                <Button variant="outline">Sign In</Button>
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <HeroSection onSearch={handleSearch} />

        {/* Search Interface */}
        {showResults && (
          <SearchInterface 
            query={searchQuery} 
            onQueryChange={setSearchQuery}
            candidates={mockCandidates}
          />
        )}

        {/* Features Section */}
        <FeaturesSection />

        {/* Dashboard Preview */}
        <DashboardSection />

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">TalentCopilot</span>
                </div>
                <p className="text-slate-400">
                  AI-powered hiring that transforms recruitment with intelligent candidate matching and automated screening.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-slate-400">
                  <li>Candidate Search</li>
                  <li>AI Screening</li>
                  <li>Analytics</li>
                  <li>Integrations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-slate-400">
                  <li>About</li>
                  <li>Careers</li>
                  <li>Privacy</li>
                  <li>Terms</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-slate-400">
                  <li>Documentation</li>
                  <li>Help Center</li>
                  <li>Contact</li>
                  <li>Status</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
              <p>&copy; 2024 TalentCopilot. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
