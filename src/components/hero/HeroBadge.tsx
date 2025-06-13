
import { Sparkles } from "lucide-react";

const HeroBadge = () => {
  return (
    <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 mt-12 mb-16">
      <Sparkles className="w-4 h-4 text-blue-400 mr-2" />
      <span className="text-sm text-blue-100">AI-Powered Prompt Engineering</span>
    </div>
  );
};

export default HeroBadge;
