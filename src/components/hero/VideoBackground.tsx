
import { useEffect, useRef } from "react";

const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const setupVideo = (video: HTMLVideoElement | null) => {
      if (video) {
        video.playbackRate = 1.0;
        video.addEventListener('loadeddata', () => {
          video.playbackRate = 1.0;
        });
        
        // Handle seamless looping to prevent jump cut
        video.addEventListener('timeupdate', () => {
          if (video.duration - video.currentTime < 0.5) {
            video.style.filter = 'blur(2px)';
            setTimeout(() => {
              if (video.style.filter) {
                video.style.filter = 'blur(0px)';
              }
            }, 300);
          }
        });
      }
    };

    setupVideo(videoRef.current);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-75 transition-all duration-300"
      >
        <source src="https://videos.pexels.com/video-files/6528444/6528444-uhd_2560_1440_30fps.mp4" type="video/mp4" />
      </video>
      
      {/* Psychedelic animated gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/40 via-cyan-400/30 to-purple-600/40 animate-pulse z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-lime-400/20 via-orange-500/30 to-pink-600/30 z-10" 
           style={{
             animation: 'psychedelic-shift 8s ease-in-out infinite alternate'
           }}></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-cyan-300/25 via-purple-500/25 to-lime-400/25 z-10"
           style={{
             animation: 'color-cycle 12s linear infinite'
           }}></div>
      
      <div className="absolute bottom-4 right-4 z-20">
        <a 
          href="https://www.pexels.com/video/movement-of-clouds-in-the-sky-6528444/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-white/70 bg-black/40 px-2 py-1 rounded backdrop-blur-sm hover:text-white/90 transition-colors shadow-lg"
        >
          Video by DV
        </a>
      </div>
      
      <style jsx>{`
        @keyframes psychedelic-shift {
          0% { background: linear-gradient(45deg, rgba(236, 72, 153, 0.2), rgba(34, 197, 94, 0.3), rgba(147, 51, 234, 0.3)); }
          25% { background: linear-gradient(90deg, rgba(34, 197, 94, 0.3), rgba(251, 146, 60, 0.3), rgba(236, 72, 153, 0.2)); }
          50% { background: linear-gradient(135deg, rgba(251, 146, 60, 0.3), rgba(139, 92, 246, 0.3), rgba(34, 197, 94, 0.2)); }
          75% { background: linear-gradient(180deg, rgba(139, 92, 246, 0.3), rgba(6, 182, 212, 0.3), rgba(251, 146, 60, 0.2)); }
          100% { background: linear-gradient(225deg, rgba(6, 182, 212, 0.3), rgba(236, 72, 153, 0.3), rgba(139, 92, 246, 0.2)); }
        }
        
        @keyframes color-cycle {
          0% { background: linear-gradient(270deg, rgba(167, 243, 208, 0.25), rgba(139, 69, 19, 0.25), rgba(165, 243, 252, 0.25)); }
          33% { background: linear-gradient(0deg, rgba(139, 69, 19, 0.25), rgba(217, 70, 239, 0.25), rgba(167, 243, 208, 0.25)); }
          66% { background: linear-gradient(90deg, rgba(217, 70, 239, 0.25), rgba(165, 243, 252, 0.25), rgba(139, 69, 19, 0.25)); }
          100% { background: linear-gradient(180deg, rgba(165, 243, 252, 0.25), rgba(167, 243, 208, 0.25), rgba(217, 70, 239, 0.25)); }
        }
      `}</style>
    </div>
  );
};

export default VideoBackground;
