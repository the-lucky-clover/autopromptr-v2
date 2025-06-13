
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
        {/* Dashboard overlay mockup */}
        <div className="absolute inset-[8%] bg-gray-900 rounded-lg overflow-hidden opacity-90">
          <div className="h-full w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
            {/* Mock dashboard header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
                <span className="text-white text-sm font-bold">AutoPromptr</span>
              </div>
              <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
            </div>
            
            {/* Mock dashboard content */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-blue-600/20 rounded p-2">
                <div className="text-blue-400 text-xs">Active Prompts</div>
                <div className="text-white font-bold text-sm">1,247</div>
              </div>
              <div className="bg-purple-600/20 rounded p-2">
                <div className="text-purple-400 text-xs">Success Rate</div>
                <div className="text-white font-bold text-sm">94.2%</div>
              </div>
              <div className="bg-green-600/20 rounded p-2">
                <div className="text-green-400 text-xs">Platforms</div>
                <div className="text-white font-bold text-sm">12</div>
              </div>
            </div>
            
            {/* Mock chart area */}
            <div className="bg-gray-800 rounded h-16 mb-2 flex items-end justify-around p-2">
              <div className="bg-blue-500 w-1 h-4 rounded-t"></div>
              <div className="bg-purple-500 w-1 h-8 rounded-t"></div>
              <div className="bg-blue-500 w-1 h-6 rounded-t"></div>
              <div className="bg-purple-500 w-1 h-10 rounded-t"></div>
              <div className="bg-blue-500 w-1 h-3 rounded-t"></div>
              <div className="bg-purple-500 w-1 h-7 rounded-t"></div>
            </div>
            
            {/* Mock platform list */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">ChatGPT</span>
                <span className="text-green-400">●</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Claude</span>
                <span className="text-green-400">●</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Cursor</span>
                <span className="text-green-400">●</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroImage;
