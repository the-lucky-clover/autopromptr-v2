
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Zap, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled 
          ? 'translate-y-0 bg-gray-900/80 backdrop-blur-md border-b border-white/10 shadow-lg' 
          : '-translate-y-2 bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo with Zap icon - clickable link to home */}
            <a href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity relative z-50">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                AutoPromptr
              </span>
            </a>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 relative z-50">
              <a href="#" className="text-white/80 hover:text-white transition-colors font-medium">Templates</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors font-medium">Courses</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors font-medium">Community</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors font-medium">Pricing</a>
              <a href="#" className="text-white/80 hover:text-white transition-colors font-medium">Blog</a>
            </nav>
            
            {/* Desktop CTA */}
            <div className="hidden md:flex items-center space-x-4 relative z-50">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-white/10">
                      <User className="w-4 h-4" />
                      <span>{user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-900/90 backdrop-blur-md border-white/20">
                    <DropdownMenuItem onClick={signOut} className="text-white hover:bg-white/10">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full px-6"
                  onClick={() => setShowAuthModal(true)}
                >
                  Sign In / Register
                </Button>
              )}
            </div>
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-white hover:text-white/80 transition-colors relative z-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/20 relative z-50">
              <nav className="flex flex-col space-y-4">
                <a href="#" className="text-white/80 hover:text-white transition-colors font-medium">Templates</a>
                <a href="#" className="text-white/80 hover:text-white transition-colors font-medium">Courses</a>
                <a href="#" className="text-white/80 hover:text-white transition-colors font-medium">Community</a>
                <a href="#" className="text-white/80 hover:text-white transition-colors font-medium">Pricing</a>
                <a href="#" className="text-white/80 hover:text-white transition-colors font-medium">Blog</a>
                <div className="flex flex-col space-y-2 pt-4 border-t border-white/20">
                  {user ? (
                    <Button variant="ghost" onClick={signOut} className="justify-start text-white hover:bg-white/10">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  ) : (
                    <Button 
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full justify-start"
                      onClick={() => setShowAuthModal(true)}
                    >
                      Sign In / Register
                    </Button>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
};

export default Header;
