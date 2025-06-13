
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Zap, Users, Target } from "lucide-react";

const Speedometers = () => {
  const metrics = [
    {
      icon: TrendingUp,
      title: "Response Time",
      value: "85%",
      improvement: "Faster AI responses",
      color: "from-green-400 to-emerald-600"
    },
    {
      icon: Target,
      title: "Success Rate",
      value: "99%",
      improvement: "Prompt accuracy",
      color: "from-blue-400 to-purple-600"
    },
    {
      icon: Users,
      title: "User Satisfaction",
      value: "96%",
      improvement: "Happy customers",
      color: "from-purple-400 to-pink-600"
    },
    {
      icon: Zap,
      title: "Platform Coverage",
      value: "100%",
      improvement: "All major platforms",
      color: "from-orange-400 to-red-600"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 via-blue-900/20 to-purple-900/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Performance That Speaks for Itself
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            See how AutoPromptr transforms your AI workflow with measurable results
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 bg-gray-900/50 backdrop-blur-sm border border-white/10">
              <CardHeader className="pb-4 text-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${metric.color} rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <metric.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-bold text-white">
                  {metric.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className={`text-4xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent mb-2`}>
                  {metric.value}
                </div>
                <p className="text-gray-400 text-sm">
                  {metric.improvement}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Speedometers;
