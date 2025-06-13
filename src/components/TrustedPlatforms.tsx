
const TrustedPlatforms = () => {
  const platforms = [
    { name: "bolt.new", logo: "⚡" },
    { name: "replit", logo: "🔄" },
    { name: "v0.dev", logo: "🎯" },
    { name: "a0.dev", logo: "⭐" },
    { name: "create.xyz", logo: "✨" },
    { name: "lovable.dev", logo: "💜" }
  ];

  // Duplicate the array for seamless scrolling
  const duplicatedPlatforms = [...platforms, ...platforms];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-blue-900/20 via-gray-900 to-purple-900/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by AI Coding Platforms
          </h2>
          <p className="text-lg text-gray-300">
            Seamlessly integrated with all major development platforms
          </p>
        </div>
        
        <div className="relative overflow-hidden">
          <div className="flex animate-scroll">
            {duplicatedPlatforms.map((platform, index) => (
              <div 
                key={index}
                className="flex items-center justify-center min-w-[200px] mx-8 p-6 bg-gray-900/30 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/20 transition-colors"
              >
                <span className="text-2xl mr-3">{platform.logo}</span>
                <span className="text-white font-medium text-lg whitespace-nowrap">
                  {platform.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedPlatforms;
