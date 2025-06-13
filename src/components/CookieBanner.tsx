
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Cookie } from "lucide-react";

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAcceptedCookies = localStorage.getItem('autopromptr-cookies-accepted');
    if (!hasAcceptedCookies) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('autopromptr-cookies-accepted', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('autopromptr-cookies-accepted', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-900/95 backdrop-blur-md border-t border-white/20 animate-slide-in-from-bottom">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Cookie className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <div className="text-sm text-gray-300">
              <p className="mb-2">
                We use cookies to enhance your experience and analyze our traffic. By continuing to use our site, you consent to our use of cookies.
              </p>
              <a href="#" className="text-blue-400 hover:text-blue-300 underline text-xs">
                Learn more about our privacy policy
              </a>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Decline
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Accept All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDecline}
              className="text-gray-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
