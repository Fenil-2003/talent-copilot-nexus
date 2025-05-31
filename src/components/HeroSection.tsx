
import { useState } from "react";
import { Search, Zap, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeroSectionProps {
  onSearch: (query: string) => void;
}

const HeroSection = ({ onSearch }: HeroSectionProps) => {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const exampleQueries = [
    "Senior React developer with 5+ years experience",
    "AI engineer with Python and machine learning background",
    "Product manager with fintech experience",
    "DevOps engineer familiar with AWS and Kubernetes"
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
              AI-Powered Hiring
              <br />
              <span className="text-slate-900">Made Simple</span>
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Search for candidates with natural language, get AI-powered insights, and automate your entire hiring pipeline. 
              From search to hire in minutes, not weeks.
            </p>
          </div>

          {/* Search Interface */}
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <Input
                type="text"
                placeholder="Search for candidates using natural language..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 pr-24 h-14 text-lg border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-0 shadow-lg bg-white/90 backdrop-blur-sm"
              />
              <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                <Button 
                  onClick={handleSearch}
                  className="h-10 px-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Example Queries */}
            <div className="space-y-3">
              <p className="text-sm text-slate-500">Try searching for:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {exampleQueries.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(example)}
                    className="px-3 py-1.5 text-sm bg-white/60 hover:bg-white/80 border border-slate-200 rounded-full transition-all duration-200 hover:scale-105"
                  >
                    "{example}"
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-16">
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600">10M+</div>
              <div className="text-slate-600">Candidate Profiles</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600">95%</div>
              <div className="text-slate-600">Accuracy Rate</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold text-blue-600">80%</div>
              <div className="text-slate-600">Time Saved</div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-indigo-200/30 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-purple-200/30 rounded-full animate-pulse delay-500"></div>
      </div>
    </section>
  );
};

export default HeroSection;
