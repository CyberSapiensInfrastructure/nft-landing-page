import React, { useState, useEffect } from "react";
import providenceVideo from "../assets/video/footer_video.mp4";

interface CountdownTimerProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className="relative overflow-hidden bg-[#0c0c0c] border border-[#d8624b]/20 rounded-lg">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0514] via-[#0f0514]/90 to-transparent z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-10"
        >
          <source src={providenceVideo} type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6">
        <div className="text-center space-y-3 sm:space-y-4">
          <div className="text-xs sm:text-sm uppercase tracking-[0.2em] text-[#d8624b]">
            Quest Ends In
          </div>
          <div className="flex justify-center items-center gap-3 sm:gap-6">
            {timeUnits.map((unit, index) => (
              <React.Fragment key={unit.label}>
                <div className="text-center">
                  <div className="text-2xl sm:text-4xl font-light bg-gradient-to-r from-[#d8624b] to-[#d8624b] bg-clip-text text-transparent font-mono min-w-[2ch] inline-block">
                    {String(unit.value).padStart(2, "0")}
                  </div>
                  <div className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/60 mt-1 sm:mt-2">
                    {unit.label}
                  </div>
                </div>
                {index < timeUnits.length - 1 && (
                  <div className="text-xl sm:text-3xl text-[#d8624b] font-light">
                    :
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
