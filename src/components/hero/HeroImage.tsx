
const HeroImage = () => {
  return (
    <div className="flex-1 max-w-lg">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-3xl"></div>
        <img 
          src="https://images.unsplash.com/photo-1677696795198-5ac0e21060ed"
          alt="AI Prompt Engineering Interface"
          className="relative w-full h-auto rounded-2xl shadow-2xl border border-slate-700/50"
        />
      </div>
    </div>
  );
};

export default HeroImage;
