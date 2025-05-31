
import { Search, Zap, BarChart3, MessageSquare, Shield, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FeaturesSection = () => {
  const features = [
    {
      icon: Search,
      title: "Natural Language Search",
      description: "Search for candidates using plain English. No complex Boolean queries or filters needed.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Zap,
      title: "AI-Powered Screening",
      description: "Automatically screen candidates with AI-generated questions and intelligent scoring.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Get insights into your hiring pipeline with advanced analytics and performance metrics.",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: MessageSquare,
      title: "Automated Outreach",
      description: "Personalized candidate outreach with AI-generated messages and follow-up sequences.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Shield,
      title: "Bias Reduction",
      description: "Built-in bias detection and mitigation to ensure fair and inclusive hiring practices.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Collaborate with your hiring team with shared pipelines and real-time updates.",
      gradient: "from-teal-500 to-blue-500"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Everything you need to hire better
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            From candidate discovery to final hire, our AI-powered platform streamlines every step of your recruitment process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-slate-200 bg-white/60 backdrop-blur-sm"
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
