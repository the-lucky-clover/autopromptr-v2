
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
        className="absolute inset-0 w-full h-full object-cover opacity-75"
      >
        <source src="https://videos.pexels.com/video-files/6528444/6528444-uhd_2560_1440_30fps.mp4" type="video/mp4" />
      </video>
      
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/60 via-blue-900/60 to-slate-900/60 z-10"></div>
      
      <div className="absolute bottom-4 right-4 z-20">
        <a 
          href="https://www.pexels.com/video/movement-of-clouds-in-the-sky-6528444/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-white/70 bg-black/40 px-2 py-1 rounded backdrop-blur-sm hover:text-white/90 transition-colors"
        >
          Video by DV
        </a>
      </div>
    </div>
  );
};

export default VideoBackground;
