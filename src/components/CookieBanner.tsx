
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookie-consent');
    if (!cookieChoice) {
      setIsVisible(true);
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-t border-white/10 p-4">
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
            className="border-white/30 text-white hover:bg-white/10 whitespace-nowrap"
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
  );
};

export default CookieBanner;
