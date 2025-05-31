
import { BarChart3, TrendingUp, Users, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const DashboardSection = () => {
  const metrics = [
    { label: "Active Searches", value: "12", change: "+3 this week", icon: BarChart3 },
    { label: "Candidates Found", value: "247", change: "+18% vs last month", icon: Users },
    { label: "Response Rate", value: "64%", change: "+12% improvement", icon: TrendingUp },
    { label: "Time to Hire", value: "8.5 days", change: "-3.2 days avg", icon: Clock }
  ];

  const recentActivity = [
    { action: "New candidate match", candidate: "Sarah Chen", role: "Senior Frontend Dev", time: "2 min ago", score: 96 },
    { action: "Outreach sent", candidate: "Marcus Johnson", role: "Full Stack Engineer", time: "15 min ago", score: 92 },
    { action: "Interview scheduled", candidate: "Elena Rodriguez", role: "AI/ML Engineer", time: "1 hour ago", score: 94 },
    { action: "Candidate responded", candidate: "David Kim", role: "Product Manager", time: "2 hours ago", score: 88 }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Real-time insights and analytics
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Track your hiring performance with comprehensive dashboards and actionable insights.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-slate-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {metric.label}
                </CardTitle>
                <metric.icon className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-slate-900">{metric.value}</div>
                <p className="text-xs text-green-600 font-medium">
                  {metric.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pipeline Status */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Hiring Pipeline
              </CardTitle>
              <CardDescription>
                Current status across all open positions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Sourcing</span>
                  <span className="text-sm text-slate-500">24 candidates</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Screening</span>
                  <span className="text-sm text-slate-500">12 candidates</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Interviews</span>
                  <span className="text-sm text-slate-500">8 candidates</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-700">Final Review</span>
                  <span className="text-sm text-slate-500">3 candidates</span>
                </div>
                <Progress value={20} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Recent Activity
              </CardTitle>
              <CardDescription>
                Latest updates from your hiring pipeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50/50 hover:bg-slate-100/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-slate-900">
                          {activity.action}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {activity.score}% match
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600">
                        {activity.candidate} • {activity.role}
                      </div>
                    </div>
                    <span className="text-xs text-slate-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
