
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import AuthModal from "@/components/AuthModal";

const Hero = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);

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

  // Slow down video playback and setup seamless looping
  useEffect(() => {
    const setupVideo = (video: HTMLVideoElement | null) => {
      if (video) {
        video.playbackRate = 0.4; // Slow, hypnotic movement
        video.addEventListener('loadeddata', () => {
          video.playbackRate = 0.4;
        });
      }
    };

    setupVideo(videoRef1.current);
    setupVideo(videoRef2.current);
  }, []);

  return (
    <>
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-6 px-4"
        style={{
          background: 'linear-gradient(to bottom right, rgb(30, 58, 138), rgb(30, 64, 175), rgb(88, 28, 135))'
        }}
      >
        {/* Dual Video Background for Seamless Loop */}
        <div className="absolute inset-0 z-0">
          {/* Primary Video */}
          <video
            ref={videoRef1}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-100"
          >
            <source src="https://videos.pexels.com/video-files/6528444/6528444-uhd_2560_1440_30fps.mp4" type="video/mp4" />
          </video>
          
          {/* Secondary Video for Crossfade */}
          <video
            ref={videoRef2}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-0 animate-pulse"
            style={{ animationDelay: '15s', animationDuration: '30s' }}
          >
            <source src="https://videos.pexels.com/video-files/6528444/6528444-uhd_2560_1440_30fps.mp4" type="video/mp4" />
          </video>
          
          {/* Psychedelic Color Overlays */}
          {/* Primary Dayglo Gradient */}
          <div 
            className="absolute inset-0 z-10 animate-pulse"
            style={{
              background: 'linear-gradient(45deg, rgba(0,255,255,0.3), rgba(255,0,255,0.3), rgba(0,255,0,0.3), rgba(255,20,147,0.3))',
              mixBlendMode: 'color-dodge',
              animation: 'psychedelic-shift 8s ease-in-out infinite'
            }}
          ></div>
          
          {/* Secondary Color Layer */}
          <div 
            className="absolute inset-0 z-10"
            style={{
              background: 'radial-gradient(circle at 30% 70%, rgba(138,43,226,0.4), rgba(255,255,0,0.2), rgba(0,255,255,0.3))',
              mixBlendMode: 'screen',
              animation: 'rave-pulse 6s ease-in-out infinite reverse'
            }}
          ></div>
          
          {/* Chromatic Aberration Effect */}
          <div 
            className="absolute inset-0 z-10"
            style={{
              background: 'linear-gradient(90deg, rgba(255,0,0,0.1), transparent, rgba(0,255,0,0.1), transparent, rgba(0,0,255,0.1))',
              mixBlendMode: 'overlay',
              animation: 'chromatic-shift 4s linear infinite'
            }}
          ></div>
          
          {/* Subtle text readability overlay */}
          <div className="absolute inset-0 bg-black/10 z-15"></div>
          
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
        <div className="relative z-20 max-w-4xl mx-auto text-center">
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
        
        {/* Custom CSS Animations */}
        <style jsx>{`
          @keyframes psychedelic-shift {
            0% { 
              background: linear-gradient(45deg, rgba(0,255,255,0.3), rgba(255,0,255,0.3), rgba(0,255,0,0.3), rgba(255,20,147,0.3));
              filter: hue-rotate(0deg);
            }
            25% { 
              background: linear-gradient(135deg, rgba(255,0,255,0.4), rgba(0,255,0,0.3), rgba(255,255,0,0.3), rgba(138,43,226,0.3));
              filter: hue-rotate(90deg);
            }
            50% { 
              background: linear-gradient(225deg, rgba(0,255,0,0.3), rgba(255,255,0,0.4), rgba(0,255,255,0.3), rgba(255,0,255,0.3));
              filter: hue-rotate(180deg);
            }
            75% { 
              background: linear-gradient(315deg, rgba(255,255,0,0.3), rgba(0,255,255,0.4), rgba(255,20,147,0.3), rgba(0,255,0,0.3));
              filter: hue-rotate(270deg);
            }
            100% { 
              background: linear-gradient(45deg, rgba(0,255,255,0.3), rgba(255,0,255,0.3), rgba(0,255,0,0.3), rgba(255,20,147,0.3));
              filter: hue-rotate(360deg);
            }
          }
          
          @keyframes rave-pulse {
            0%, 100% { 
              opacity: 0.3;
              transform: scale(1);
            }
            50% { 
              opacity: 0.6;
              transform: scale(1.05);
            }
          }
          
          @keyframes chromatic-shift {
            0% { transform: translateX(-2px); }
            25% { transform: translateX(2px) translateY(-1px); }
            50% { transform: translateX(1px) translateY(2px); }
            75% { transform: translateX(-1px) translateY(1px); }
            100% { transform: translateX(-2px); }
          }
        `}</style>
      </section>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
};

export default Hero;
