
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import AuthModal from "@/components/AuthModal";

const Hero = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 pt-4 px-4">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-40 left-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6 sm:mb-8">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 mr-2" />
            <span className="text-xs sm:text-sm text-white/90">AI-Powered Prompt Engineering</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent block">
              Supercharge Your AI
            </span>
            <span className="block">
              Prompt Workflow
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
            Intelligently batch process, enhance, and deploy prompts across all major AI coding platforms AND local development tools. Transform your development workflow with AutoPromptr's powerful automation tools, whether you prefer cloud-based or local development environments.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 sm:px-0">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base">
              Get Started Free
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 rounded-full backdrop-blur-sm transition-all duration-300 text-sm sm:text-base"
              onClick={() => setShowAuthModal(true)}
            >
              Sign In
            </Button>
          </div>
          
          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-white/60">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white">10K+</div>
              <div className="text-xs sm:text-sm">Premium Prompts</div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white">50K+</div>
              <div className="text-xs sm:text-sm">Happy Users</div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/20"></div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-white">99%</div>
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
