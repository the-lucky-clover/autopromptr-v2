
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import AuthModal from "@/components/AuthModal";

const Hero = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  // Setup video for seamless looping
  useEffect(() => {
    const setupVideo = (video: HTMLVideoElement | null) => {
      if (video) {
        video.playbackRate = 1.0; // Full speed
        video.addEventListener('loadeddata', () => {
          video.playbackRate = 1.0;
        });
      }
    };

    setupVideo(videoRef.current);
  }, []);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background with Lower Opacity */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          >
            <source src="https://videos.pexels.com/video-files/6528444/6528444-uhd_2560_1440_30fps.mp4" type="video/mp4" />
          </video>
          
          {/* Clean gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 opacity-90 z-10"></div>
          
          {/* Video Attribution */}
          <div className="absolute bottom-4 right-4 z-20">
            <a 
              href="https://www.pexels.com/video/movement-of-clouds-in-the-sky-6528444/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-white/70 bg-black/40 px-2 py-1 rounded backdrop-blur-sm hover:text-white/90 transition-colors"
            >
              Video by DV
            </a>
          </div>
        </div>
        
        {/* Content */}
        <div className="relative z-20 max-w-6xl mx-auto px-4 text-center">
          {/* Hero Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-600/20 backdrop-blur-sm border border-blue-400/30 mb-8">
            <Sparkles className="w-4 h-4 text-blue-400 mr-2" />
            <span className="text-sm text-blue-100">AI-Powered Prompt Engineering</span>
          </div>
          
          {/* Main Hero Content */}
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="flex-1 text-left lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="block">Supercharge Your</span>
                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  AI Prompt Workflow
                </span>
              </h1>
              
              <p className="text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
                Intelligently batch process, enhance, and deploy prompts across all major AI coding platforms AND local development tools.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-slate-400/50 bg-transparent text-white hover:bg-white/10 px-8 py-4 rounded-lg transition-all duration-300"
                  onClick={() => setShowAuthModal(true)}
                >
                  Sign In
                </Button>
              </div>
              
              {/* Stats */}
              <div 
                ref={statsRef}
                className={`flex items-center gap-8 text-slate-400 transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className={`text-center transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="text-3xl font-bold text-white">10K+</div>
                  <div className="text-sm">Premium Prompts</div>
                </div>
                <div className="w-px h-8 bg-slate-600"></div>
                <div className={`text-center transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="text-3xl font-bold text-white">50K+</div>
                  <div className="text-sm">Happy Users</div>
                </div>
                <div className="w-px h-8 bg-slate-600"></div>
                <div className={`text-center transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <div className="text-3xl font-bold text-white">99%</div>
                  <div className="text-sm">Success Rate</div>
                </div>
              </div>
            </div>
            
            {/* Right Hero Image */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-3xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1677696795198-5ac0e21060ed"
                  alt="AI Prompt Engineering Interface"
                  className="relative w-full h-auto rounded-2xl shadow-2xl border border-slate-700/50"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
};

export default Hero;
