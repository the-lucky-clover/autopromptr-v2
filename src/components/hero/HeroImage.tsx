
const HeroImage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-3xl"></div>
        <img 
          src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80"
          alt="AutoPromptr Dashboard on Laptop"
          className="relative w-full h-auto rounded-2xl shadow-2xl border border-slate-700/50"
        />
      </div>
    </div>
  );
};

export default HeroImage;
