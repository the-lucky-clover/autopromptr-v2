
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
        
        // Extended seamless looping with 4-5 second crossfade (no blur effects)
        video.addEventListener('timeupdate', () => {
          if (video.duration - video.currentTime < 4.5) { // Start crossfade 4.5 seconds before end
            const remainingTime = video.duration - video.currentTime;
            const fadeProgress = (4.5 - remainingTime) / 4.5; // 0 to 1 over 4.5 seconds
            
            // Gradual opacity changes only (no blur)
            const opacity = Math.max(0.4, 0.8 - (fadeProgress * 0.4));
            
            video.style.opacity = opacity.toString();
            video.style.filter = 'saturate(2.0) contrast(1.2)';
          } else {
            // Reset to normal state with super-saturation
            video.style.opacity = '0.8';
            video.style.filter = 'saturate(2.0) contrast(1.2)';
          }
        });

        // Reset on loop start with smooth transition and maintain saturation
        video.addEventListener('seeked', () => {
          video.style.opacity = '0.8';
          video.style.filter = 'saturate(2.0) contrast(1.2)';
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
        className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-[4500ms] ease-in-out"
        style={{
          filter: 'saturate(2.0) contrast(1.2)'
        }}
        key={currentVideoSrc} // Force re-render when video source changes
      >
        <source src={currentVideoSrc} type="video/mp4" />
      </video>
      
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
