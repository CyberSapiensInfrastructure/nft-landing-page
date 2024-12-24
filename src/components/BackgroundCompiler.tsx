import React, { useState, useEffect } from "react";
import desktopVideo from "../assets/img/providence-video-bg.webm";
import mobileImage from "../assets/img/providence-hero-artwork.webp";

const BackgroundCompiler: React.FC = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const content = isDesktop ? (
    <video
      autoPlay
      loop
      muted
      className="h-full w-full object-cover"
      src={desktopVideo}
    />
  ) : (
    <img
      src={mobileImage}
      alt="mobile"
      className="h-full w-full object-cover backdrop-filter-xl"
    />
  );

  return (
    <div className="absolute top-0 left-0 z-[-1] h-screen w-full">
      {content}
    </div>
  );
};

export default BackgroundCompiler;
