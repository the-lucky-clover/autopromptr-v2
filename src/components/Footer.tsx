
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Mail, Twitter, Github, Linkedin, MessageSquare, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Footer = ()=> {
  const [isFooterCtaLightningActive, setIsFooterCtaLightningActive] = useState(false);

  const handleFooterCtaClick = () => {
    setIsFooterCtaLightningActive(true);
    setTimeout(() => setIsFooterCtaLightningActive(false), 800);
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* CTA Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h2 className="text-4xl md:text-6xl font-bold leading-tight font-sans mb-6">
            Ready to Transform Your <br className="hidden sm:block" />
            AI Experience Today?
          </h2>
          <div className="space-y-2 mb-8">
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-sans">
              Join thousands of AI pros and enthusiasts who are already creating better AI
            </p>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-sans">
              utilizing our exclusive premium prompt solutions.
            </p>
          </div>
          <Button 
            size="lg" 
            className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full group shadow-[0_8px_32px_rgba(59,130,246,0.3)] transition-all duration-300"
            onClick={handleFooterCtaClick}
          >
            {/* Idle sheen layers */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-1/3 h-full transform -translate-x-full rotate-45 animate-idle-metallic-sheen pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent w-1/4 h-full transform -translate-x-full rotate-47 animate-rare-glass-sheen-1 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/18 to-transparent w-1/3 h-full transform -translate-x-full rotate-43 animate-rare-glass-sheen-2 pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/22 to-transparent w-1/5 h-full transform -translate-x-full rotate-49 animate-rare-glass-sheen-3 pointer-events-none"></div>
            
            {/* Hover sheen overlay */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent w-1/2 h-full transform translate-x-full -translate-y-full rotate-45 group-hover:animate-enhanced-metallic-sheen pointer-events-none"></span>
            
            {/* Lightning flash overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r from-cyan-400/40 via-white/50 to-pink-400/40 pointer-events-none ${isFooterCtaLightningActive ? 'animate-lightning-flash' : 'opacity-0'}`}></div>
            
            <span className="relative z-10">Start Your Free Trial</span>
          </Button>
        </div>
      </div>
      
      {/* Main Footer */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-[0_4px_16px_rgba(59,130,246,0.4)]">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent font-sans">
                AutoPromptr
              </h3>
            </div>
            <p className="text-gray-400 leading-relaxed">
              The premier platform for AI prompt engineering excellence. Master the art of crafting <br className="hidden lg:block" />
              effective prompts and unlock AI's full potential.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
                <Github className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
                <MessageSquare className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Products */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Products</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Prompt Templates</a></li>
              <li><a href="#" className="hover:text-white transition-colors">AI Courses</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Prompt Builder</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Analytics Dashboard</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Access</a></li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tutorials</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Best Practices</a></li>
            </ul>
          </div>
          
          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8 bg-gray-800" />
        
        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 AutoPromptr. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>thepremiumbrand@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
