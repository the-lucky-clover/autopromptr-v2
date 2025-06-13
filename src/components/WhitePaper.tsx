
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
    <section ref={sectionRef} className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Industry White Papers
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Deep insights into AI prompt engineering and development workflow optimization
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm text-gray-500 mb-2">AutoPromptr White Paper</div>
              <CardTitle className="text-2xl mb-2">AI Prompt Engineering Best Practices</CardTitle>
              <CardDescription className="text-base">
                A comprehensive guide to optimizing AI prompts for maximum effectiveness across development platforms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-3">Executive Summary</h4>
                <p className="text-sm text-gray-600 mb-4">
                  As AI-assisted development becomes mainstream, the quality of prompts directly impacts productivity and code quality. This white paper presents data-driven insights from analyzing over 100,000 prompt executions across major AI coding platforms.
                </p>
                
                <h5 className="font-medium mb-2">Key Findings:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Well-structured prompts increase success rates by 73%</li>
                  <li>• Batch processing reduces execution time by 45%</li>
                  <li>• Platform-specific optimization improves output quality by 62%</li>
                  <li>• Local development integration boosts developer satisfaction by 89%</li>
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-2">Table of Contents</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>1. Introduction to Modern Prompt Engineering</li>
                  <li>2. Platform-Specific Optimization Strategies</li>
                  <li>3. Batch Processing and Automation</li>
                  <li>4. Local Development Integration</li>
                  <li>5. Performance Metrics and ROI Analysis</li>
                  <li>6. Future Trends and Recommendations</li>
                </ul>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Download className="w-4 h-4 mr-2" />
                Download White Paper (PDF)
              </Button>
            </CardContent>
          </Card>

          <Card className={`transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div className="text-sm text-gray-500 mb-2">AutoPromptr Case Study</div>
              <CardTitle className="text-2xl mb-2">Streamlining Development Workflows</CardTitle>
              <CardDescription className="text-base">
                Real-world implementation results from enterprise teams using AutoPromptr
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white p-6 rounded-lg border">
                <h4 className="font-semibold mb-3">Case Study: TechCorp Inc.</h4>
                <p className="text-sm text-gray-600 mb-4">
                  A Fortune 500 technology company reduced development cycle time by 40% using AutoPromptr's batch processing and local tool integration.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="text-2xl font-bold text-green-600">40%</div>
                    <div className="text-sm text-green-700">Faster Development</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">73%</div>
                    <div className="text-sm text-blue-700">Error Reduction</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h5 className="font-medium text-green-900 mb-2">Implementation Results</h5>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• 200+ developers onboarded in 30 days</li>
                  <li>• 10,000+ prompts processed monthly</li>
                  <li>• 85% developer satisfaction score</li>
                  <li>• $2.3M annual productivity savings</li>
                  <li>• 99.7% system uptime achieved</li>
                </ul>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                <Download className="w-4 h-4 mr-2" />
                Download Case Study (PDF)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default WhitePaper;
