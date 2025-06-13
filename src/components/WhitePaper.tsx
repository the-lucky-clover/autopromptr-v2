
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const WhitePaper = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl font-bold text-white mb-4">
            Industry White Papers
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Deep insights into AI prompt engineering and development workflow optimization
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className={`group hover:shadow-2xl transition-all duration-500 bg-gray-800/50 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:scale-105 flex flex-col h-full ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}>
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-500/25">
                <Zap className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="text-sm text-gray-400 mb-2">AutoPromptr White Paper</div>
              <CardTitle className="text-2xl mb-2 text-white group-hover:text-blue-400 transition-colors duration-300">AI Prompt Engineering Best Practices</CardTitle>
              <CardDescription className="text-base text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                A comprehensive guide to optimizing AI prompts for maximum effectiveness across development platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-1 flex flex-col">
              <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600 group-hover:bg-gray-700/70 group-hover:border-gray-500 transition-all duration-300">
                <h4 className="font-semibold mb-3 text-white">Executive Summary</h4>
                <p className="text-sm text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
                  As AI-assisted development becomes mainstream, the quality of prompts directly impacts productivity and code quality. This white paper presents data-driven insights from analyzing over 100,000 prompt executions across major AI coding platforms.
                </p>
                
                <h5 className="font-medium mb-2 text-white">Key Findings:</h5>
                <ul className="text-sm text-gray-300 space-y-1 group-hover:text-gray-200 transition-colors duration-300">
                  <li>• Well-structured prompts increase success rates by 73%</li>
                  <li>• Batch processing reduces execution time by 45%</li>
                  <li>• Platform-specific optimization improves output quality by 62%</li>
                  <li>• Local development integration boosts developer satisfaction by 89%</li>
                </ul>
              </div>
              
              <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20 group-hover:bg-blue-500/15 group-hover:border-blue-500/30 transition-all duration-300">
                <h5 className="font-medium text-blue-300 mb-2">Table of Contents</h5>
                <ul className="text-sm text-blue-200 space-y-1">
                  <li>1. Introduction to Modern Prompt Engineering</li>
                  <li>2. Platform-Specific Optimization Strategies</li>
                  <li>3. Batch Processing and Automation</li>
                  <li>4. Local Development Integration</li>
                  <li>5. Performance Metrics and ROI Analysis</li>
                  <li>6. Future Trends and Recommendations</li>
                </ul>
              </div>
              
              <div className="mt-auto">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-300 group-hover:shadow-lg">
                  <Download className="w-4 h-4 mr-2" />
                  Download White Paper (PDF)
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className={`group hover:shadow-2xl transition-all duration-500 bg-gray-800/50 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:scale-105 flex flex-col h-full ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: isVisible ? '400ms' : '0ms' }}>
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-500/25">
                <FileText className="w-8 h-8 text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="text-sm text-gray-400 mb-2">AutoPromptr Case Study</div>
              <CardTitle className="text-2xl mb-2 text-white group-hover:text-green-400 transition-colors duration-300">Streamlining Development Workflows</CardTitle>
              <CardDescription className="text-base text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                Real-world implementation results from enterprise teams using AutoPromptr
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex-1 flex flex-col">
              <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600 group-hover:bg-gray-700/70 group-hover:border-gray-500 transition-all duration-300">
                <h4 className="font-semibold mb-3 text-white">Case Study: TechCorp Inc.</h4>
                <p className="text-sm text-gray-300 mb-4 group-hover:text-gray-200 transition-colors duration-300">
                  A Fortune 500 technology company reduced development cycle time by 40% using AutoPromptr's batch processing and local tool integration.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-green-500/10 rounded border border-green-500/20 group-hover:bg-green-500/15 group-hover:border-green-500/30 transition-all duration-300">
                    <div className="text-2xl font-bold text-green-400">40%</div>
                    <div className="text-sm text-green-300">Faster Development</div>
                  </div>
                  <div className="text-center p-3 bg-blue-500/10 rounded border border-blue-500/20 group-hover:bg-blue-500/15 group-hover:border-blue-500/30 transition-all duration-300">
                    <div className="text-2xl font-bold text-blue-400">73%</div>
                    <div className="text-sm text-blue-300">Error Reduction</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20 group-hover:bg-green-500/15 group-hover:border-green-500/30 transition-all duration-300">
                <h5 className="font-medium text-green-300 mb-2">Implementation Results</h5>
                <ul className="text-sm text-green-200 space-y-1">
                  <li>• 200+ developers onboarded in 30 days</li>
                  <li>• 10,000+ prompts processed monthly</li>
                  <li>• 85% developer satisfaction score</li>
                  <li>• $2.3M annual productivity savings</li>
                  <li>• 99.7% system uptime achieved</li>
                </ul>
              </div>
              
              <div className="mt-auto">
                <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 hover:scale-105 transition-all duration-300 group-hover:shadow-lg">
                  <Download className="w-4 h-4 mr-2" />
                  Download Case Study (PDF)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhitePaper;
