
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Zap, User, LogOut, BarChart3, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AuthModal from "@/components/AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DynamicHeader = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        if (currentScrollY > lastScrollY) {
          setIsVisible(true);
        } else if (currentScrollY < lastScrollY) {
          setIsVisible(false);
        }
      } else {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="bg-gray-900/20 backdrop-blur-md border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Interactive Logo with metallic sheen animations */}
              <a 
                href="https://app.autopromptr.com" 
                className="flex items-center space-x-2 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] group cursor-pointer"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_4px_16px_rgba(59,130,246,0.4)] relative overflow-hidden transition-all duration-300 group-hover:shadow-[0_6px_24px_rgba(59,130,246,0.6)] group-active:scale-95">
                  {/* Metallic sheen overlay - only on hover and mousedown */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent w-1/2 h-full transform translate-x-full -translate-y-full rotate-45 group-hover:animate-enhanced-metallic-sheen group-active:animate-enhanced-metallic-sheen pointer-events-none"></div>
                  <Zap className="w-5 h-5 text-white relative z-10" />
                </div>
                <span className="text-xl font-bold text-white relative overflow-hidden">
                  {/* Metallic sheen overlay for text - only on hover and mousedown */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2 h-full transform translate-x-full -translate-y-full rotate-45 group-hover:animate-enhanced-metallic-sheen group-active:animate-enhanced-metallic-sheen pointer-events-none"></span>
                  <span className="relative z-10">AutoPromptr</span>
                </span>
              </a>
              
              {/* Navigation */}
              <div className="flex items-center space-x-4">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-white/10">
                        <User className="w-4 h-4" />
                        <span>{user.email}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-900/90 backdrop-blur-md border-white/20">
                      <DropdownMenuItem asChild>
                        <a href="/dashboard" className="text-white hover:bg-white/10 cursor-pointer">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Dashboard
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href="/profile" className="text-white hover:bg-white/10 cursor-pointer">
                          <Settings className="w-4 h-4 mr-2" />
                          Profile
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/20" />
                      <DropdownMenuItem onClick={signOut} className="text-white hover:bg-white/10">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full px-6"
                    onClick={() => setShowAuthModal(true)}
                  >
                    Get Started / Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
};

export default DynamicHeader;
