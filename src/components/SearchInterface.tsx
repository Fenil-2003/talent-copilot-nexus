
import { useState } from "react";
import { Search, Filter, SortAsc, Grid2x2, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import CandidateCard from "./CandidateCard";

interface Candidate {
  id: number;
  name: string;
  title: string;
  company: string;
  location: string;
  score: number;
  skills: string[];
  experience: string;
  education: string;
  avatar: string;
  highlights: string[];
}

interface SearchInterfaceProps {
  query: string;
  onQueryChange: (query: string) => void;
  candidates: Candidate[];
}

const SearchInterface = ({ query, onQueryChange, candidates }: SearchInterfaceProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('score');
  const [filters, setFilters] = useState({
    experience: '',
    location: '',
    skills: ''
  });

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
                placeholder="Refine your search..."
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                className="pl-10 h-12 border-slate-200 rounded-lg"
              />
            </div>
            <Button variant="outline" className="h-12 px-4">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Experience: 5+ years
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Remote OK
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Tech: React
            </Badge>
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
                <SelectItem value="experience">Experience</SelectItem>
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
        <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
          {candidates.map((candidate, index) => (
            <div key={candidate.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <CandidateCard candidate={candidate} viewMode={viewMode} />
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" className="px-8">
            Load More Results
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SearchInterface;
