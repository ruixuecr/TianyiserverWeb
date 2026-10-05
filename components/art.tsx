export function Art({
  theme = "tower",
  className = "",
}: {
  theme?: string;
  className?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 800 540"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`sky-${theme}`} x2="0" y2="1">
          <stop stopColor={theme === "stage" ? "#213a39" : "#e9e9d8"} />
          <stop
            offset="1"
            stopColor={theme === "stage" ? "#496b60" : "#f2c5a6"}
          />
        </linearGradient>
        <linearGradient id={`water-${theme}`} x2="1" y2="1">
          <stop stopColor="#a9c8bb" />
          <stop offset="1" stopColor="#567f76" />
        </linearGradient>
      </defs>
      <path fill={`url(#sky-${theme})`} d="M0 0h800v540H0z" />
      <circle
        cx="600"
        cy="150"
        r="67"
        fill={theme === "stage" ? "#e2dfb9" : "#f9e9bc"}
        opacity=".85"
      />
      <path d="M0 325Q120 240 250 317T500 293T800 285V540H0" fill="#a7b6a4" />
      <path
        d="M0 395Q180 320 400 387T800 355V540H0"
        fill={`url(#water-${theme})`}
      />
      {theme === "stage" ? (
        <>
          <path
            d="M140 390L220 180H570L670 390"
            stroke="#d4e4c5"
            strokeWidth="6"
          />
          <path
            d="M220 180L370 390H170ZM570 180L430 390H640Z"
            fill="#e8e6b6"
            opacity=".18"
          />
          <rect x="260" y="260" width="280" height="140" fill="#1a3633" />
          <text
            x="400"
            y="338"
            fill="#f0e8cf"
            textAnchor="middle"
            fontSize="44"
            fontFamily="serif"
            letterSpacing="12"
          >
            ENCORE
          </text>
          {Array.from({ length: 27 }, (_, i) => (
            <path
              key={i}
              d={`M${i * 32} 540v-${60 + (i % 4) * 15}m0 20l-10 -20m10 20l10 -30`}
              stroke="#163e36"
              strokeWidth="14"
            />
          ))}
        </>
      ) : theme === "shop" || theme === "food" ? (
        <g>
          <rect
            x="135"
            y="190"
            width="530"
            height="250"
            rx="5"
            fill="#f1e8d2"
          />
          <rect x="150" y="275" width="500" height="158" fill="#537c72" />
          <path
            d="M390 275v158M420 275v158M150 365h240M420 365h230"
            stroke="#e3d7bc"
            strokeWidth="9"
          />
          <rect
            x="115"
            y="205"
            width="570"
            height="72"
            fill={theme === "shop" ? "#557e97" : "#9c6046"}
          />
          <text
            x="400"
            y="254"
            textAnchor="middle"
            fontSize="32"
            fill="#fff4dd"
            letterSpacing="6"
          >
            {theme === "shop" ? "中百罗森" : "天宝饭庄"}
          </text>
          <path d="M120 277h560l-18 32H138Z" fill="#efe0c1" />
          <path d="M120 438h560" stroke="#6c7662" strokeWidth="12" />
          <text
            x="400"
            y="170"
            textAnchor="middle"
            fontSize="14"
            fill="#7e846d"
            letterSpacing="5"
          >
            {theme === "shop" ? "街角补给站" : "江城烟火气"}
          </text>
        </g>
      ) : theme === "house" ? (
        <g>
          <path d="M130 440V215L390 140 680 230V440Z" fill="#ac7053" />
          <path d="M390 140L680 230V440H390Z" fill="#935b44" />
          <path
            d="M110 216L390 128 700 229"
            stroke="#645d4b"
            strokeWidth="16"
          />
          {[255, 320, 385].map((y) => (
            <g key={y}>
              {[185, 260, 335, 430, 505, 580].map((x) => (
                <g key={x}>
                  <path
                    d={`M${x} ${y + 30}v-25a14 14 0 0 1 28 0v25Z`}
                    fill="#e9d8b6"
                  />
                  <path
                    d={`M${x + 14} ${y - 6}v36`}
                    stroke="#626858"
                    strokeWidth="3"
                  />
                </g>
              ))}
            </g>
          ))}
          <path
            d="M390 148V440M125 296h560M125 362h560"
            stroke="#d9aa83"
            strokeWidth="4"
          />
          <path d="M110 445h590" stroke="#707561" strokeWidth="13" />
        </g>
      ) : theme === "museum" ? (
        <g>
          <rect x="175" y="270" width="450" height="170" fill="#c0aa84" />
          <path
            d="M120 274Q310 252 400 200Q490 252 680 274L645 292H155Z"
            fill="#626c60"
          />
          <path
            d="M235 217Q350 195 400 158Q450 195 565 217L545 234H255Z"
            fill="#647263"
          />
          {[200, 270, 340, 410, 480, 550].map((x) => (
            <rect
              key={x}
              x={x}
              y="300"
              width="45"
              height="125"
              fill="#7a8270"
            />
          ))}
          <path
            d="M150 440h500m-530 16h560m-590 16h620"
            stroke="#d7c7a8"
            strokeWidth="14"
          />
        </g>
      ) : theme === "tower" ? (
        <g transform="translate(245 100)" fill="#714c35">
          <path d="M0 340h320v15H0zM35 315h250v25H35z" />
          <path d="M105 80h100v235H105z" fill="#b98051" />
          {[80, 135, 195, 265].map((y, i) => (
            <g key={y}>
              <path
                d={`M${80 - i * 17} ${y}Q155 ${y - 8} 155 ${y - 40}Q155 ${y - 8} ${230 + i * 17} ${y}L${244 + i * 17} ${y + 8}H${66 - i * 17}Z`}
              />
              <path
                d={`M${98 - i * 12} ${y + 12}H${212 + i * 12}v8H${98 - i * 12}z`}
                fill="#e0b26e"
              />
              {[120, 145, 170, 195].map((x) => (
                <path
                  key={x}
                  d={`M${x} ${y + 24}v22`}
                  stroke="#533f2f"
                  strokeWidth="8"
                />
              ))}
            </g>
          ))}
          <path d="M155 40V12" stroke="#714c35" strokeWidth="5" />
        </g>
      ) : theme === "river" ? (
        <g stroke="#c77650">
          <path d="M0 345H800" strokeWidth="16" />
          <path d="M140 345V175M640 345V175" strokeWidth="13" />
          <path
            d="M140 180Q380 430 640 180M0 270L140 180M640 180L800 280"
            strokeWidth="5"
          />
          {Array.from({ length: 21 }, (_, i) => (
            <path
              key={i}
              d={`M${i * 40} 345V${i < 4 ? 260 - i * 22 : i > 16 ? 180 + (i - 16) * 25 : 200 + Math.sin(((i - 4) / 12) * Math.PI) * 90}`}
              strokeWidth="3"
            />
          ))}
        </g>
      ) : (
        <>
          <ellipse cx="510" cy="430" rx="72" ry="5" fill="#e1e1bf" />
          <path d="M480 418h80l-15 12h-50z" fill="#594b36" />
          <path d="M518 418v-64l34 55h-34" fill="#f5e9cd" />
          <g fill="#406957">
            {[40, 100, 170, 730, 790].map((x, i) => (
              <path
                key={x}
                d={`M${x} 440v-170m-50 80l50 -120 50 120z`}
                stroke="#406957"
                strokeWidth="7"
              />
            ))}
          </g>
        </>
      )}
      <path
        d="M40 490h135m350-23h170m-450-20h95"
        stroke="#e2e6cc"
        strokeWidth="2"
        opacity=".6"
      />
    </svg>
  );
}
