
import { MessageSquare, Mail, ArrowUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Candidate {
  id: string;
  name: string;
  title: string;
  company: string;
  location: string;
  score: number;
  skills: string[];
  experience_years: number;
  experience: string;
  education: string;
  avatar?: string;
  highlights?: string[];
  email?: string;
  status: string;
  notes?: string;
}

interface CandidateCardProps {
  candidate: Candidate;
  viewMode: 'grid' | 'list';
}

const CandidateCard = ({ candidate, viewMode }: CandidateCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-slate-600 bg-slate-100';
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-slate-200 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={candidate.avatar} alt={candidate.name} />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                {candidate.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                {candidate.name}
              </h3>
              <p className="text-sm text-slate-600">{candidate.title}</p>
              <p className="text-xs text-slate-500">{candidate.company} • {candidate.location}</p>
            </div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(candidate.score)}`}>
            {candidate.score}% match
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Skills */}
        <div>
          <div className="flex flex-wrap gap-1.5">
            {candidate.skills.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs bg-slate-100 hover:bg-slate-200">
                {skill}
              </Badge>
            ))}
            {candidate.skills.length > 4 && (
              <Badge variant="secondary" className="text-xs bg-slate-100">
                +{candidate.skills.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Experience & Education */}
        <div className="text-sm text-slate-600 space-y-1">
          <div className="flex items-center justify-between">
            <span>Experience:</span>
            <span className="font-medium">{candidate.experience}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Education:</span>
            <span className="font-medium text-xs">{candidate.education}</span>
          </div>
        </div>

        {/* AI Highlights */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3 text-blue-500" />
            <span className="text-xs font-medium text-blue-600">AI Insights</span>
          </div>
          <ul className="text-xs text-slate-600 space-y-1">
            {candidate.highlights?.slice(0, 2).map((highlight, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-1 h-1 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button size="sm" className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
            <MessageSquare className="w-3 h-3 mr-1" />
            Contact
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Mail className="w-3 h-3 mr-1" />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateCard;
