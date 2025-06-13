
import { useEffect, useRef, useState } from "react";

const VideoBackground = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoSrc, setCurrentVideoSrc] = useState<string>("");

  // Array of video sources for random selection
  const videoSources = [
    {
      url: "https://videos.pexels.com/video-files/6528444/6528444-uhd_2560_1440_30fps.mp4",
      attribution: "Video by DV"
    },
    {
      url: "https://videos.pexels.com/video-files/5170522/5170522-uhd_2560_1440_30fps.mp4", 
      attribution: "Video by Pexels"
    }
  ];

  const [selectedVideo, setSelectedVideo] = useState(videoSources[0]);

  useEffect(() => {
    // Randomly select video source on component mount
    const randomIndex = Math.floor(Math.random() * videoSources.length);
    const selected = videoSources[randomIndex];
    setSelectedVideo(selected);
    setCurrentVideoSrc(selected.url);
  }, []);

  useEffect(() => {
    const setupVideo = (video: HTMLVideoElement | null) => {
      if (video && currentVideoSrc) {
        video.playbackRate = 0.75; // Slowed down by 25%
        video.addEventListener('loadeddata', () => {
          video.playbackRate = 0.75; // Ensure playback rate is set after load
        });
        
        // Enhanced smooth loop transition - start 15 seconds before end, 10-second duration
        video.addEventListener('timeupdate', () => {
          // Apply smooth transition to all videos
          if (video.duration - video.currentTime < 15) { // Start crossfade 15 seconds before end
            const remainingTime = video.duration - video.currentTime;
            const fadeProgress = (15 - remainingTime) / 10; // 10-second transition duration
            
            // Exponential fade curve for ultra-smooth transition
            const exponentialFade = Math.pow(fadeProgress, 1.5);
            const opacity = Math.max(0.3, 0.6 - (exponentialFade * 0.3)); // Gradual fade from 60% to 30%
            
            video.style.opacity = opacity.toString();
            video.style.filter = 'brightness(0.7) saturate(2.0) contrast(1.5)';
          } else {
            // Normal state with enhanced darkening and contrast
            video.style.opacity = '0.6';
            video.style.filter = 'brightness(0.7) saturate(2.0) contrast(1.5)';
          }
        });

        // Reset on loop start with smooth transition and maintain enhanced filters
        video.addEventListener('seeked', () => {
          video.style.opacity = '0.6';
          video.style.filter = 'brightness(0.7) saturate(2.0) contrast(1.5)';
        });
      }
    };

    setupVideo(videoRef.current);
  }, [currentVideoSrc]);

  if (!currentVideoSrc) {
    return null; // Don't render until video source is selected
  }

  return (
    <div className="absolute inset-0 z-0">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-all duration-[10000ms] ease-in-out"
        style={{
          filter: 'brightness(0.7) saturate(2.0) contrast(1.5)'
        }}
        key={currentVideoSrc} // Force re-render when video source changes
      >
        <source src={currentVideoSrc} type="video/mp4" />
      </video>
      
      {/* Psychedelic Dayglo Overlays - Multiple layers for subtle animated color shifts */}
      
      {/* Primary psychedelic overlay - 45s cycle with pink/green/purple */}
      <div className="absolute inset-0 z-5 opacity-10 mix-blend-overlay pointer-events-none animate-psychedelic-shift"></div>
      
      {/* Secondary color cycle overlay - 50s cycle with emerald/brown/magenta/cyan */}
      <div className="absolute inset-0 z-6 opacity-8 mix-blend-soft-light pointer-events-none animate-color-cycle" style={{ animationDelay: '12s' }}></div>
      
      {/* Tertiary holographic overlay - 8s cycle with blue/purple/pink holographic effect */}
      <div className="absolute inset-0 z-7 opacity-15 mix-blend-overlay pointer-events-none animate-holographic" style={{ animationDelay: '5s' }}></div>
      
      {/* Enhanced black linear gradient overlay - darker and more prominent */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/0 via-black/50 to-black/85"></div>
      
      <div className="absolute bottom-4 right-4 z-20">
        <a 
          href={selectedVideo.url.includes('6528444') ? "https://www.pexels.com/video/movement-of-clouds-in-the-sky-6528444/" : "https://www.pexels.com/video/5170522/"}
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-white/70 bg-black/40 px-2 py-1 rounded backdrop-blur-sm hover:text-white/90 transition-colors shadow-lg"
        >
          {selectedVideo.attribution}
        </a>
      </div>
    </div>
  );
};

export default VideoBackground;
