
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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)]' 
          : 'bg-transparent'
      }`}>
        {/* Enhanced intermittent navbar glass sheen overlays - multiple rare animations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/3 h-full transform -translate-x-full rotate-45 animate-navbar-glass-sheen"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent w-1/4 h-full transform -translate-x-full rotate-47 animate-rare-glass-sheen-1"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/18 to-transparent w-1/3 h-full transform -translate-x-full rotate-43 animate-rare-glass-sheen-2"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/22 to-transparent w-1/5 h-full transform -translate-x-full rotate-49 animate-rare-glass-sheen-3"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-16">
            {/* Logo with enhanced drop shadow - matching hero headline font */}
            <div className="flex items-center space-x-2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_4px_16px_rgba(59,130,246,0.4)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/3 h-full transform -translate-x-full rotate-45 group-hover:animate-sheen pointer-events-none"></div>
                <Zap className="w-5 h-5 text-white relative z-10" />
              </div>
              <span className="text-xl font-bold text-white font-sans">
                AutoPromptr
              </span>
            </div>
            
            {/* Desktop Navigation with enhanced center alignment and responsive spacing */}
            <nav className="hidden md:flex items-center justify-center flex-1 px-4 lg:px-8">
              <div className="flex items-center space-x-8 lg:space-x-12">
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

            <div className="flex items-center">
              <Button 
                className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-4 lg:px-6 py-2 lg:py-3 text-sm lg:text-base shadow-[0_4px_16px_rgba(59,130,246,0.4)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] group transition-all duration-300 hover:shadow-[0_6px_24px_rgba(59,130,246,0.6)]"
                onClick={handleHeaderButtonClick}
              >
                {/* Hover-only metallic sheen overlay - REMOVED idle animation */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent w-1/2 h-full transform translate-x-full -translate-y-full rotate-45 group-hover:animate-enhanced-metallic-sheen pointer-events-none"></span>
                
                {/* Lightning flash overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r from-cyan-400/40 via-white/50 to-pink-400/40 pointer-events-none ${isHeaderLightningActive ? 'animate-lightning-flash' : 'opacity-0'}`}></div>
                
                <span className="relative z-10">Get Started / Sign In</span>
              </Button>
            </div>

            {/* Mobile Menu Button with enhanced styling */}
            <button
              className="md:hidden text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] relative group p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/20 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded blur-sm"></div>
              {isMenuOpen ? <X className="w-6 h-6 relative z-10" /> : <Menu className="w-6 h-6 relative z-10" />}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu with better responsiveness */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="px-4 py-4 space-y-4">
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
                className="relative overflow-hidden w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full group py-3 text-base"
                onClick={handleMobileButtonClick}
              >
                {/* Hover-only metallic sheen overlay - REMOVED idle animation */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent w-1/2 h-full transform translate-x-full -translate-y-full rotate-45 group-hover:animate-enhanced-metallic-sheen pointer-events-none"></span>
                
                {/* Lightning flash overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r from-cyan-400/40 via-white/50 to-pink-400/40 pointer-events-none ${isMobileLightningActive ? 'animate-lightning-flash' : 'opacity-0'}`}></div>
                
                <span className="relative z-10">Get Started / Sign In</span>
              </Button>
            </div>
          </div>
        )}
      </header>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
};

export default Header;
