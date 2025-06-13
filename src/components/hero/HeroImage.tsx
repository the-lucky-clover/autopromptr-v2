
const HeroImage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl blur-3xl transition-all duration-700 group-hover:blur-2xl group-hover:from-blue-500/40 group-hover:to-purple-500/40"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-transparent to-pink-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <img 
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
          alt="AI Development Workflow Visualization"
          className="relative w-full h-auto rounded-2xl shadow-2xl border border-slate-700/50 transition-all duration-500 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] group-hover:border-blue-400/30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent rounded-2xl pointer-events-none"></div>
        
        {/* 2Advanced-inspired tech overlay */}
        <div className="absolute top-4 right-4 w-3 h-3 bg-blue-400 rounded-full animate-pulse opacity-70"></div>
        <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-60" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/2 left-4 w-1 h-8 bg-gradient-to-b from-blue-400/50 to-transparent opacity-40"></div>
      </div>
    </div>
  );
};

export default HeroImage;
