"use client";

import {
  createContext,
  useContext,
  useEffect,
  useId,
  useState,
  type ReactNode,
} from "react";
import { ChevronDown, Clock3, Sparkles, X } from "lucide-react";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Switch } from "./ui/switch";

const MotionContext = createContext({
  enabled: true,
  reduced: false,
  toggle: (_enabled: boolean) => {},
});
const preferenceKey = "encore-theme-motion";
const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Shanghai",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});
const dateFormatter = new Intl.DateTimeFormat("zh-CN", {
  timeZone: "Asia/Shanghai",
  month: "long",
  day: "numeric",
  weekday: "long",
});

export function TimeTheme({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    try {
      setEnabled(localStorage.getItem(preferenceKey) !== "off");
    } catch {
      // The visual preference remains usable when storage is unavailable.
    }
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  function toggle(value: boolean) {
    setEnabled(value);
    try {
      localStorage.setItem(preferenceKey, value ? "on" : "off");
    } catch {
      // This preference is optional and never blocks navigation.
    }
  }

  return (
    <MotionContext.Provider value={{ enabled, reduced, toggle }}>
      <div
        className="encore-theme"
        data-motion={enabled && !reduced ? "on" : "off"}
      >
        {children}
      </div>
    </MotionContext.Provider>
  );
}

function ClockFace({ time }: { time: string | null }) {
  const [hours, minutes, seconds] = time
    ? time.split(":").map(Number)
    : [0, 0, 0];
  return (
    <svg className="moment-clock" viewBox="0 0 200 200" aria-hidden="true">
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
            transform={`rotate(${hours * 30 + minutes / 2} 100 100)`}
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
  const { enabled, reduced, toggle } = useContext(MotionContext);
  const headingId = useId();
  const motionId = useId();
  useEffect(() => {
    const update = () => setNow(new Date());
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);
  const time = now ? timeFormatter.format(now) : null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="moment-trigger" aria-label="打开武汉此刻与动效设置">
          <Clock3 size={15} strokeWidth={1.5} />
          <span>武汉此刻</span>
          <time dateTime={now?.toISOString()}>
            {time?.slice(0, 5) || "--:--"}
          </time>
          <ChevronDown size={12} className="moment-chevron" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="moment-popover" aria-labelledby={headingId}>
        <div className="moment-heading">
          <div>
            <span className="moment-kicker">A MOMENT IN WUHAN</span>
            <h2 id={headingId}>把这一刻，留给热爱。</h2>
          </div>
          <PopoverClose className="moment-close" aria-label="关闭时钟">
            <X size={17} />
          </PopoverClose>
        </div>
        <ClockFace time={time} />
        <div className="moment-readout">
          <time dateTime={now?.toISOString()}>{time || "--:--:--"}</time>
          <p>{now ? dateFormatter.format(now) : "武汉"} · UTC+8</p>
        </div>
        <div className="moment-motion">
          <Sparkles size={17} strokeWidth={1.5} />
          <label htmlFor={motionId}>
            轻盈动效
            <small>
              {reduced ? "已跟随系统减少动态效果" : "让花瓣与光环慢慢流转"}
            </small>
          </label>
          <Switch
            id={motionId}
            checked={enabled && !reduced}
            disabled={reduced}
            onCheckedChange={toggle}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
