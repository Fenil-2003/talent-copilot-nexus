
import { useState, useEffect } from "react";
import { Search, Filter, Grid2x2, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import CandidateCard from "./CandidateCard";
import { useCandidates } from "@/hooks/useCandidates";

interface SearchInterfaceProps {
  query: string;
  onQueryChange: (query: string) => void;
  candidates: any[];
}

const SearchInterface = ({ query, onQueryChange }: SearchInterfaceProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('score');
  const { candidates, loading, searchCandidates } = useCandidates();

  useEffect(() => {
    if (query) {
      searchCandidates(query);
    }
  }, [query]);

  const handleSearch = () => {
    if (query.trim()) {
      searchCandidates(query);
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search for candidates using natural language..."
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 h-12 border-slate-200 rounded-lg"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading} className="h-12 px-6">
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <p className="text-slate-600">
              Found <span className="font-semibold text-slate-900">{candidates.length}</span> candidates
            </p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score">Best Match</SelectItem>
                <SelectItem value="experience_years">Experience</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="location">Location</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid2x2 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">AI is searching for candidates...</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
            {candidates.map((candidate, index) => (
              <div key={candidate.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CandidateCard candidate={candidate} viewMode={viewMode} />
              </div>
            ))}
          </div>
        )}

        {candidates.length === 0 && !loading && query && (
          <div className="text-center py-12">
            <p className="text-slate-600">No candidates found. Try a different search query.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchInterface;
