
import { useEffect, useRef, useState } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "AI Product Manager at TechCorp",
    content: "AutoPromptr has revolutionized our AI workflow. We've increased our prompt efficiency by 300% and saved countless hours of manual optimization.",
    rating: 5,
    avatar: "SC"
  },
  {
    name: "Marcus Rodriguez",
    role: "Senior Developer at InnovateLab",
    content: "The batch processing feature is incredible. What used to take us days now happens in minutes. This tool is essential for any serious AI development team.",
    rating: 5,
    avatar: "MR"
  },
  {
    name: "Dr. Emily Watson",
    role: "Research Director at AI Institute",
    content: "The analytics and optimization suggestions have helped us achieve breakthrough results in our research. AutoPromptr is now integral to our methodology.",
    rating: 5,
    avatar: "EW"
  },
  {
    name: "Alex Thompson",
    role: "Freelance AI Consultant",
    content: "As a consultant working with multiple clients, AutoPromptr's multi-platform deployment saves me hours every week. The ROI has been exceptional.",
    rating: 5,
    avatar: "AT"
  },
  {
    name: "Lisa Park",
    role: "Content Strategy Lead",
    content: "The prompt templates library is phenomenal. We've improved our content quality dramatically while reducing the time spent on prompt engineering.",
    rating: 5,
    avatar: "LP"
  },
  {
    name: "David Kumar",
    role: "CTO at StartupX",
    content: "AutoPromptr's enterprise security features give us confidence to use AI at scale. The compliance tools are exactly what we needed.",
    rating: 5,
    avatar: "DK"
  }
];

const SocialProof = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-4 bg-gray-900 relative overflow-hidden">
      {/* Dark background with subtle effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(147,51,234,0.05),transparent_50%)]"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 font-sans">
            Trusted by Thousands of Professionals
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-sans">
            Join the community of AI professionals who have transformed <br className="hidden sm:block" />
            their workflow with AutoPromptr
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`group p-6 rounded-2xl bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-gray-700/50 hover:border-purple-500/50 hover:shadow-[0_8px_32px_rgba(147,51,234,0.15)] transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="text-white font-semibold font-sans">{testimonial.name}</h4>
                  <p className="text-gray-400 text-sm font-sans">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex items-center mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <div className="relative">
                <Quote className="w-6 h-6 text-purple-400/50 absolute -top-2 -left-1" />
                <p className="text-gray-300 leading-relaxed pl-4 font-sans">{testimonial.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
