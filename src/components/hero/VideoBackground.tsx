
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
        video.playbackRate = 1.0;
        video.addEventListener('loadeddata', () => {
          video.playbackRate = 1.0;
        });
        
        // Enhanced seamless looping with extended crossfade (10 seconds for ultra-smooth transition)
        video.addEventListener('timeupdate', () => {
          if (video.duration - video.currentTime < 10.0) { // Start crossfade 10 seconds before end
            const remainingTime = video.duration - video.currentTime;
            const fadeProgress = (10.0 - remainingTime) / 10.0; // 0 to 1 over 10 seconds
            
            // Ultra-gradual opacity and blur changes for perfect transition
            const opacity = Math.max(0.4, 0.8 - (fadeProgress * 0.4));
            const blur = fadeProgress * 1.5;
            
            video.style.opacity = opacity.toString();
            video.style.filter = `blur(${blur}px)`;
          } else {
            // Reset to normal state
            video.style.opacity = '0.8';
            video.style.filter = 'blur(0px)';
          }
        });

        // Reset on loop start with smooth transition
        video.addEventListener('seeked', () => {
          video.style.opacity = '0.8';
          video.style.filter = 'blur(0px)';
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
        className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-[4000ms] ease-in-out"
        key={currentVideoSrc} // Force re-render when video source changes
      >
        <source src={currentVideoSrc} type="video/mp4" />
      </video>
      
      {/* Enhanced 2Advanced-inspired psychedelic animated gradient overlays with higher saturation */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/35 via-cyan-400/30 to-purple-600/40 animate-pulse z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-lime-400/30 via-orange-500/35 to-pink-600/35 z-10 animate-psychedelic-shift"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-cyan-300/25 via-purple-500/30 to-lime-400/30 z-10 animate-color-cycle"></div>
      
      {/* Additional 2Advanced-style tech overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-purple-900/20 z-10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)] z-10"></div>
      
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
