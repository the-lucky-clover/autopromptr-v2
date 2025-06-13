
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
        
        // Enhanced seamless looping with extended crossfade (increased to 8 seconds)
        video.addEventListener('timeupdate', () => {
          if (video.duration - video.currentTime < 8.0) { // Start crossfade 8 seconds before end
            const remainingTime = video.duration - video.currentTime;
            const fadeProgress = (8.0 - remainingTime) / 8.0; // 0 to 1 over 8 seconds
            
            // Enhanced gradual opacity and blur changes for ultra-smooth transition
            const opacity = Math.max(0.3, 0.75 - (fadeProgress * 0.45));
            const blur = fadeProgress * 2.0;
            
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
        className="absolute inset-0 w-full h-full object-cover opacity-75 transition-all duration-[3000ms] ease-in-out"
        key={currentVideoSrc} // Force re-render when video source changes
      >
        <source src={currentVideoSrc} type="video/mp4" />
      </video>
      
      {/* Enhanced psychedelic animated gradient overlays - more saturated and smoother transitions */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/30 via-cyan-400/25 to-purple-600/35 animate-pulse z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-lime-400/25 via-orange-500/30 to-pink-600/25 z-10 animate-psychedelic-shift"></div>
      <div className="absolute inset-0 bg-gradient-to-bl from-cyan-300/20 via-purple-500/25 to-lime-400/20 z-10 animate-color-cycle"></div>
      
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
