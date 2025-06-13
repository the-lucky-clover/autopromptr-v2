
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";
import AuthModal from "@/components/AuthModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isHeaderLightningActive, setIsHeaderLightningActive] = useState(false);
  const [isMobileLightningActive, setIsMobileLightningActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleHeaderButtonClick = () => {
    setIsHeaderLightningActive(true);
    setTimeout(() => setIsHeaderLightningActive(false), 800);
    setShowAuthModal(true);
  };

  const handleMobileButtonClick = () => {
    setIsMobileLightningActive(true);
    setTimeout(() => setIsMobileLightningActive(false), 800);
    setShowAuthModal(true);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)] animate-slide-down' 
          : 'bg-transparent md:bg-transparent bg-black/20 md:bg-transparent backdrop-blur-none md:backdrop-blur-none'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-14 md:h-16">
            {/* Logo - Mobile optimized with enhanced visibility */}
            <a 
              href="https://app.autopromptr.com" 
              className="flex items-center space-x-1 sm:space-x-1.5 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] group cursor-pointer flex-shrink-0"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_4px_16px_rgba(59,130,246,0.4)] transition-all duration-300 group-hover:shadow-[0_6px_24px_rgba(59,130,246,0.6)] group-active:scale-95">
                <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-5 md:h-5 text-white" />
              </div>
              <span className="text-sm sm:text-base md:text-xl lg:text-2xl font-black bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_3px_6px_rgba(0,0,0,0.8)] font-sans">
                AutoPromptr
              </span>
            </a>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center justify-center flex-1 px-8 lg:px-12">
              <div className="flex items-center space-x-10 lg:space-x-14">
                <button 
                  onClick={() => scrollToSection('features')} 
                  className="relative text-white hover:text-blue-400 transition-all duration-300 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] group text-sm lg:text-base"
                >
                  <span className="relative z-10">Features</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </button>
                <button 
                  onClick={() => scrollToSection('templates')} 
                  className="relative text-white hover:text-blue-400 transition-all duration-300 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] group text-sm lg:text-base"
                >
                  <span className="relative z-10">Templates</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </button>
                <button 
                  onClick={() => scrollToSection('pricing')} 
                  className="relative text-white hover:text-blue-400 transition-all duration-300 font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] group text-sm lg:text-base"
                >
                  <span className="relative z-10">Pricing</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </button>
              </div>
            </nav>

            {/* Desktop CTA Button */}
            <div className="hidden md:flex items-center">
              <Button 
                className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base shadow-[0_4px_16px_rgba(59,130,246,0.4)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] group transition-all duration-300 hover:shadow-[0_6px_24px_rgba(59,130,246,0.6)]"
                onClick={handleHeaderButtonClick}
              >
                {/* Lightning flash overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r from-cyan-400/40 via-white/50 to-pink-400/40 pointer-events-none ${isHeaderLightningActive ? 'animate-lightning-flash' : 'opacity-0'}`}></div>
                
                <span className="relative z-10">Get Started</span>
              </Button>
            </div>

            {/* Mobile Menu Button - Enhanced visibility */}
            <button
              className="md:hidden text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] relative group p-2 bg-black/20 rounded-lg backdrop-blur-sm border border-white/10"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg blur-sm"></div>
              {isMenuOpen ? <X className="w-5 h-5 relative z-10" /> : <Menu className="w-5 h-5 relative z-10" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] animate-slide-down">
            <div className="px-4 py-4 space-y-3">
              <button 
                onClick={() => scrollToSection('features')} 
                className="block w-full text-left text-white hover:text-blue-400 transition-colors py-2 relative group text-base"
              >
                <span className="relative z-10">Features</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button 
                onClick={() => scrollToSection('templates')} 
                className="block w-full text-left text-white hover:text-blue-400 transition-colors py-2 relative group text-base"
              >
                <span className="relative z-10">Templates</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="block w-full text-left text-white hover:text-blue-400 transition-colors py-2 relative group text-base"
              >
                <span className="relative z-10">Pricing</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <Button 
                className="relative overflow-hidden w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full group py-3 text-base min-h-[44px]"
                onClick={handleMobileButtonClick}
              >
                {/* Lightning flash overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r from-cyan-400/40 via-white/50 to-pink-400/40 pointer-events-none ${isMobileLightningActive ? 'animate-lightning-flash' : 'opacity-0'}`}></div>
                
                <span className="relative z-10">Get Started</span>
              </Button>
            </div>
          </div>
        )}
      </header>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />

      <style jsx>{`
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-down {
          animation: slide-down 0.5s ease-out;
        }
      `}</style>
    </>
  );
};

export default Header;
