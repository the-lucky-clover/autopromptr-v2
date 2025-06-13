
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
        
        // Enhanced seamless looping with extended crossfade
        video.addEventListener('timeupdate', () => {
          if (video.duration - video.currentTime < 6.0) { // Start crossfade 6 seconds before end
            const remainingTime = video.duration - video.currentTime;
            const fadeProgress = (6.0 - remainingTime) / 6.0; // 0 to 1 over 6 seconds
            
            // Gradual opacity and blur changes for ultra-smooth transition
            const opacity = Math.max(0.4, 0.75 - (fadeProgress * 0.35));
            const blur = fadeProgress * 1.5;
            
            video.style.opacity = opacity.toString();
            video.style.filter = `blur(${blur}px)`;
          } else {
            // Reset to normal state
            video.style.opacity = '0.75';
            video.style.filter = 'blur(0px)';
          }
        });

        // Reset on loop start
        video.addEventListener('seeked', () => {
          video.style.opacity = '0.75';
          video.style.filter = 'blur(0px)';
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
        className="absolute inset-0 w-full h-full object-cover opacity-75 transition-all duration-[2000ms] ease-in-out"
      >
        <source src="https://videos.pexels.com/video-files/6528444/6528444-uhd_2560_1440_30fps.mp4" type="video/mp4" />
      </video>
      
      {/* Enhanced psychedelic animated gradient overlays - now more subtle and slower */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-cyan-400/15 to-purple-600/20 animate-pulse z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-lime-400/10 via-orange-500/15 to-pink-600/15 z-10 animate-psychedelic-shift"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-cyan-300/10 via-purple-500/10 to-lime-400/10 z-10 animate-color-cycle"></div>
      
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
