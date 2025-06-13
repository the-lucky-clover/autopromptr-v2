
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import AuthModal from "@/components/AuthModal";

const Hero = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 pt-6 px-4">
        {/* Video Background */}
        <div className="fixed inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.4)' }}
          >
            <source src="http://localhost:3000/#access_token=eyJhbGciOiJIUzI1NiIsImtpZCI6IkpwSEJYT3o5dTFLZUhSeXMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3FveHV0dmtwdGt0bXRkaWt1YmZnLnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJlMWQ5MTBmZC1kZTM4LTQ5OGYtOGJmNS1mYzI1MjM4ZGFjZjQiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ5ODA1NzU1LCJpYXQiOjE3NDk4MDIxNTUsImVtYWlsIjoicG91bmRzMUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7ImVtYWlsIjoicG91bmRzMUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiU1AiLCJwaG9uZV92ZXJpZmllZCI6ZmFsc2UsInN1YiI6ImUxZDkxMGZkLWRlMzgtNDk4Zi04YmY1LWZjMjUyMzhkYWNmNCJ9LCJyb2xlIjoiYXV0aGVudGljYXRlZCIsImFhbCI6ImFhbDEiLCJhbXIiOlt7Im1ldGhvZCI6Im90cCIsInRpbWVzdGFtcCI6MTc0OTgwMjE1NX1dLCJzZXNzaW9uX2lkIjoiYzIxYmFlYmItNjM0Ny00MDQyLWFkNWMtNGQ4ZmYyODAzMDZjIiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.MH0lDZz_sx-Ft7bd2Bu5CJnNAq6pZBdtYhWZYkBhEDU&expires_at=1749805755&expires_in=3600&refresh_token=c5vt6y4mx6lb&token_type=bearer&type=signup" type="video/mp4" />
          </video>
          
          {/* Video Attribution */}
          <div className="absolute bottom-4 right-4 z-10">
            <span className="text-xs text-white/70 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
              Video by Micro
            </span>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 sm:mb-8 mt-16 sm:mt-8">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-2" />
            <span className="text-xs sm:text-sm text-white/90">AI-Powered Prompt Engineering</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent">
              Supercharge Your
            </span>
            <span className="block text-white mt-1">
              AI Prompt Workflow
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            Intelligently batch process, enhance, and deploy prompts across all major AI coding platforms AND local development tools.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base">
              Get Started Free
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-white/40 bg-transparent text-white hover:bg-white hover:text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 text-sm sm:text-base"
              onClick={() => setShowAuthModal(true)}
            >
              Sign In
            </Button>
          </div>
          
          <div 
            ref={statsRef}
            className={`mt-8 sm:mt-12 flex items-center justify-center gap-2 sm:gap-8 text-white/60 px-2 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className={`text-center transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-white">10K+</div>
              <div className="text-xs sm:text-sm">Premium Prompts</div>
            </div>
            <div className="w-px h-4 sm:h-8 bg-white/20"></div>
            <div className={`text-center transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-white">50K+</div>
              <div className="text-xs sm:text-sm">Happy Users</div>
            </div>
            <div className="w-px h-4 sm:h-8 bg-white/20"></div>
            <div className={`text-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-bold text-white">99%</div>
              <div className="text-xs sm:text-sm">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
};

export default Hero;
