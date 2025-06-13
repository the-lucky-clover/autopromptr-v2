
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";
import AuthModal from "@/components/AuthModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

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

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-900/95 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.3)]' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo with enhanced drop shadow */}
            <div className="flex items-center space-x-2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_4px_16px_rgba(59,130,246,0.4)]">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                AutoPromptr
              </span>
            </div>
            
            {/* Desktop Navigation with drop shadows */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection('features')} 
                className="text-white hover:text-blue-400 transition-colors font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('templates')} 
                className="text-white hover:text-blue-400 transition-colors font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
              >
                Templates
              </button>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="text-white hover:text-blue-400 transition-colors font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
              >
                Pricing
              </button>
              <Button 
                className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-6 shadow-[0_4px_16px_rgba(59,130,246,0.4)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] group"
                onClick={() => setShowAuthModal(true)}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/3 h-full transform -translate-x-full rotate-45 group-hover:animate-sheen pointer-events-none"></span>
                Get Started / Sign In
              </Button>
            </nav>

            {/* Mobile Menu Button with drop shadow */}
            <button
              className="md:hidden text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900/95 backdrop-blur-md border-t border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
            <div className="px-4 py-4 space-y-4">
              <button 
                onClick={() => scrollToSection('features')} 
                className="block w-full text-left text-white hover:text-blue-400 transition-colors py-2"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('templates')} 
                className="block w-full text-left text-white hover:text-blue-400 transition-colors py-2"
              >
                Templates
              </button>
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="block w-full text-left text-white hover:text-blue-400 transition-colors py-2"
              >
                Pricing
              </button>
              <Button 
                className="relative overflow-hidden w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full group"
                onClick={() => setShowAuthModal(true)}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent w-1/3 h-full transform -translate-x-full rotate-45 group-hover:animate-sheen pointer-events-none"></span>
                Get Started / Sign In
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
