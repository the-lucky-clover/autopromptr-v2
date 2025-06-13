
import { useEffect, useRef, useState } from "react";

const VideoBackground = () => {
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const [currentVideoSrc, setCurrentVideoSrc] = useState<string>("");
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);

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
    const setupSeamlessVideoLoop = () => {
      const video1 = videoRef1.current;
      const video2 = videoRef2.current;
      
      if (!video1 || !video2 || !currentVideoSrc) return;

      // Set up both videos with the same source
      video1.src = currentVideoSrc;
      video2.src = currentVideoSrc;
      
      // Configure video properties
      [video1, video2].forEach(video => {
        video.playbackRate = 0.75;
        video.muted = true;
        video.loop = false;
        video.preload = 'auto';
      });

      // Start with video1 active
      video1.style.opacity = '0.6';
      video2.style.opacity = '0';
      video1.style.filter = 'brightness(0.7) saturate(2.0) contrast(1.5)';
      video2.style.filter = 'brightness(0.7) saturate(2.0) contrast(1.5)';

      // Handle seamless crossfade before video ends
      const handleSeamlessTransition = (currentVideo: HTMLVideoElement, nextVideo: HTMLVideoElement, videoNumber: 1 | 2) => {
        // Start crossfade at 95% completion to avoid jump cuts
        const transitionTime = currentVideo.duration * 0.95;
        
        const checkTransitionTime = () => {
          if (currentVideo.currentTime >= transitionTime) {
            // Preload next video to the beginning
            nextVideo.currentTime = 0;
            nextVideo.play().catch(console.error);
            
            // Start smooth crossfade immediately
            currentVideo.style.transition = 'opacity 1.5s ease-in-out';
            nextVideo.style.transition = 'opacity 1.5s ease-in-out';
            
            currentVideo.style.opacity = '0';
            nextVideo.style.opacity = '0.6';
            
            // Update active video state
            setActiveVideo(videoNumber === 1 ? 2 : 1);
            
            // Reset for next cycle after transition
            setTimeout(() => {
              currentVideo.currentTime = 0;
              currentVideo.style.transition = '';
              nextVideo.style.transition = '';
            }, 1500);
            
            // Stop monitoring this video
            currentVideo.removeEventListener('timeupdate', checkTransitionTime);
          }
        };

        currentVideo.addEventListener('timeupdate', checkTransitionTime);
      };

      // Set up seamless transition monitoring for both videos
      const monitorVideo1 = () => handleSeamlessTransition(video1, video2, 1);
      const monitorVideo2 = () => handleSeamlessTransition(video2, video1, 2);

      // Start monitoring when video loads and plays
      video1.addEventListener('loadeddata', () => {
        if (video1.readyState >= 2) {
          video1.addEventListener('timeupdate', monitorVideo1);
        }
      });

      video2.addEventListener('loadeddata', () => {
        if (video2.readyState >= 2) {
          video2.addEventListener('timeupdate', monitorVideo2);
        }
      });

      // Start the first video
      video1.play().catch(console.error);

      // Cleanup function
      return () => {
        video1.removeEventListener('timeupdate', monitorVideo1);
        video2.removeEventListener('timeupdate', monitorVideo2);
      };
    };

    const cleanup = setupSeamlessVideoLoop();
    return cleanup;
  }, [currentVideoSrc]);

  if (!currentVideoSrc) {
    return null; // Don't render until video source is selected
  }

  return (
    <div className="absolute inset-0 z-0">
      {/* Dual video setup for seamless looping */}
      <video
        ref={videoRef1}
        autoPlay
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out"
        style={{
          opacity: activeVideo === 1 ? '0.6' : '0',
          filter: 'brightness(0.7) saturate(2.0) contrast(1.5)'
        }}
      >
        <source src={currentVideoSrc} type="video/mp4" />
      </video>
      
      <video
        ref={videoRef2}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out"
        style={{
          opacity: activeVideo === 2 ? '0.6' : '0',
          filter: 'brightness(0.7) saturate(2.0) contrast(1.5)'
        }}
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
