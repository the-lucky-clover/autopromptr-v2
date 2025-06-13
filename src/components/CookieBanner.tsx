
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookie-consent');
    if (!cookieChoice) {
      // Show banner after 2 seconds delay for better page load experience
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const declineNonEssential = () => {
    localStorage.setItem('cookie-consent', 'essential-only');
    setIsVisible(false);
  };

  const closeBanner = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className={`fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-t border-white/10 p-4 transition-transform duration-500 ease-out ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex-1 text-sm text-white/80">
            <p>
              We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.{" "}
              <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                Learn more
              </a>
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={declineNonEssential}
              className="border-white/30 text-white/90 hover:bg-white/10 hover:text-white bg-transparent whitespace-nowrap"
            >
              Decline Non-Essential
            </Button>
            <Button
              size="sm"
              onClick={acceptAll}
              className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
            >
              Accept All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeBanner}
              className="text-white/60 hover:text-white hover:bg-white/10 p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Import and use AuthModal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Sign In</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAuthModal(false)}
                className="p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-gray-600 mb-4">
              Sign in to access your AutoPromptr dashboard and manage your prompts.
            </p>
            <div className="flex gap-2">
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                onClick={() => setShowAuthModal(false)}
              >
                Sign In
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowAuthModal(false)}
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieBanner;
