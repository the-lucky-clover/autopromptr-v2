
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
        
        // Handle seamless looping to prevent jump cut - start transition much earlier
        video.addEventListener('timeupdate', () => {
          if (video.duration - video.currentTime < 4.0) { // Start dissolve 4 seconds before end
            video.style.filter = 'blur(0.5px)';
            video.style.opacity = '0.7';
            setTimeout(() => {
              if (video.style.filter) {
                video.style.filter = 'blur(0px)';
                video.style.opacity = '0.75';
              }
            }, 1000); // Longer, smoother transition
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
        className="absolute inset-0 w-full h-full object-cover opacity-75 transition-all duration-1000"
      >
        <source src="https://videos.pexels.com/video-files/6528444/6528444-uhd_2560_1440_30fps.mp4" type="video/mp4" />
      </video>
      
      {/* Psychedelic animated gradient overlays - now more subtle and slower */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/25 via-cyan-400/20 to-purple-600/25 animate-pulse z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-lime-400/15 via-orange-500/20 to-pink-600/20 z-10 animate-psychedelic-shift"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-cyan-300/15 via-purple-500/15 to-lime-400/15 z-10 animate-color-cycle"></div>
      
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
    </div>
  );
};

export default VideoBackground;
