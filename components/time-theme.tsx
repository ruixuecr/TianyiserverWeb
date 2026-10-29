"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { ChevronDown, Clock3, X } from "lucide-react";
import { CONCERT_START, concertCountdown } from "@/lib/concert";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Shanghai",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});
export function TimeTheme({ children }: { children: ReactNode }) {
  return (
    <div className="encore-theme" data-motion="on">
      {children}
    </div>
  );
}

function ClockFace({
  time,
  countdown,
  started,
}: {
  time: string | null;
  countdown: string;
  started: boolean;
}) {
  const orbitId = useId();
  const [hours, minutes, seconds] = time
    ? time.split(":").map(Number)
    : [0, 0, 0];
  const hourAngle = (hours % 12) * 30 + minutes / 2 + seconds / 120;
  return (
    <svg className="moment-clock" viewBox="-32 -32 264 264" aria-hidden="true">
      <defs>
        <path id={orbitId} d="M -19 100 A 119 119 0 0 1 219 100" />
      </defs>
      <circle cx="100" cy="100" r="111" className="countdown-orbit-track" />
      <g className="countdown-orbit" transform={`rotate(${hourAngle} 100 100)`}>
        <circle cx="100" cy="100" r="111" className="countdown-orbit-arc" />
        <circle cx="100" cy="-11" r="2.8" className="clock-pivot" />
        <text className="countdown-orbit-text">
          <textPath href={`#${orbitId}`} startOffset="50%" textAnchor="middle">
            {started ? "演唱会已开始" : "距演唱会开始"} · {countdown}
          </textPath>
        </text>
      </g>
      <circle cx="100" cy="100" r="96" className="clock-outline" />
      <circle cx="100" cy="100" r="70" className="clock-inner" />
      {Array.from({ length: 60 }, (_, index) => (
        <line
          key={index}
          x1="100"
          y1="13"
          x2="100"
          y2={index % 5 === 0 ? "22" : "17"}
          transform={`rotate(${index * 6} 100 100)`}
          className={index % 5 === 0 ? "clock-major" : "clock-minor"}
        />
      ))}
      <text x="100" y="57" textAnchor="middle" className="clock-wordmark">
        encore.
      </text>
      {time && (
        <g strokeLinecap="round">
          <line
            x1="100"
            y1="104"
            x2="100"
            y2="64"
            transform={`rotate(${hourAngle} 100 100)`}
            className="clock-hour"
          />
          <line
            x1="100"
            y1="108"
            x2="100"
            y2="40"
            transform={`rotate(${minutes * 6 + seconds / 10} 100 100)`}
            className="clock-minute"
          />
          <line
            x1="100"
            y1="114"
            x2="100"
            y2="30"
            transform={`rotate(${seconds * 6} 100 100)`}
            className="clock-second"
          />
          <circle cx="100" cy="100" r="4" className="clock-pivot" />
        </g>
      )}
      <text x="100" y="151" textAnchor="middle" className="clock-city">
        WUHAN
      </text>
    </svg>
  );
}

export function WuhanMoment() {
  const [now, setNow] = useState<Date | null>(null);
  const headingId = useId();
  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    window.addEventListener("focus", update);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("focus", update);
    };
  }, []);
  const time = now ? timeFormatter.format(now) : null;
  const countdown = now
    ? concertCountdown(now.getTime())
    : { started: false, text: "--:--:--" };
  const label = countdown.started ? "演唱会已开始" : "距演唱会开始";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="moment-trigger" aria-label="打开演唱会倒计时">
          <Clock3 size={15} strokeWidth={1.5} />
          <span>{label}</span>
          <span className="moment-countdown">{countdown.text}</span>
          <ChevronDown size={12} className="moment-chevron" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="moment-popover" aria-labelledby={headingId}>
        <div className="moment-heading">
          <div>
            <span className="moment-kicker">COUNTING DOWN TO ENCORE</span>
            <h2 id={headingId}>把这一刻，留给热爱。</h2>
          </div>
          <PopoverClose className="moment-close" aria-label="关闭时钟">
            <X size={17} />
          </PopoverClose>
        </div>
        <ClockFace
          time={time}
          countdown={countdown.text}
          started={countdown.started}
        />
        <div className="moment-readout">
          <p className="moment-countdown-label">{label}</p>
          <span className="moment-countdown-value">{countdown.text}</span>
          <p>
            <time dateTime={CONCERT_START}>10月31日 19:12</time> · 北京时间
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
