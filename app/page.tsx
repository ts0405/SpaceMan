"use client";

import { useEffect, useRef, useState } from "react";

type PortfolioItem = {
  name: string;
  symbol: string;
  value: number;
  color: string;
  performance: {
    "1D": number;
    "1W": number;
    "1M": number;
    "1Y": number;
  };
};

const portfolio: PortfolioItem[] = [
  {
    name: "NASDAQ 100",
    symbol: "NDX",
    value: 60,
    color: "rgba(255, 255, 255, 0.9)",
    performance: {
      "1D": 0.82,
      "1W": 2.41,
      "1M": 5.73,
      "1Y": 18.42,
    },
  },
  {
    name: "Cash",
    symbol: "JPY",
    value: 25,
    color: "rgba(255, 255, 255, 0.38)",
    performance: {
      "1D": 0,
      "1W": 0,
      "1M": 0,
      "1Y": 0,
    },
  },
  {
    name: "Crypto",
    symbol: "BTC",
    value: 10,
    color: "rgba(255, 255, 255, 0.18)",
    performance: {
      "1D": 2.31,
      "1W": 6.82,
      "1M": 14.27,
      "1Y": 42.71,
    },
  },
  {
    name: "USD",
    symbol: "USD/JPY",
    value: 5,
    color: "rgba(255, 255, 255, 0.08)",
    performance: {
      "1D": 0.34,
      "1W": 1.21,
      "1M": 3.84,
      "1Y": 12.36,
    },
  },
];

const periods = ["1D", "1W", "1M", "1Y"] as const;

type Period = (typeof periods)[number];

export default function Home() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [entered, setEntered] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [period, setPeriod] = useState<Period>("1Y");

  const enterSite = () => {
    setEntered(true);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;

      videoRef.current
        .play()
        .catch(() => {});
    }

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.35;

      audioRef.current
        .play()
        .then(() => {
          setSoundOn(true);
        })
        .catch(() => {
          setSoundOn(false);
        });
    }
  };

  const toggleSound = () => {
    if (!audioRef.current) return;

    if (soundOn) {
      audioRef.current.pause();
      setSoundOn(false);
    } else {
      audioRef.current.volume = 0.35;

      audioRef.current
        .play()
        .then(() => {
          setSoundOn(true);
        })
        .catch(() => {
          setSoundOn(false);
        });
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    return () => {
      videoRef.current?.pause();
      audioRef.current?.pause();
    };
  }, []);
  useEffect(() => {
    const text = "SpaceMan";

    let index = 0;
    let deleting = false;

    const typeSpeed = 150;
    const deleteSpeed = 90;
    const pauseAtEnd = 1000;
    const pauseAtStart = 350;

    let timeout: ReturnType<typeof setTimeout>;

    const animate = () => {
      if (!deleting) {
        index++;

        document.title = `@${text.slice(0, index)}`;

        if (index >= text.length) {
          deleting = true;
          timeout = setTimeout(animate, pauseAtEnd);
          return;
        }

        timeout = setTimeout(animate, typeSpeed);
      } else {
        index--;

        document.title = `@${text.slice(0, index)}`;

        if (index <= 0) {
          deleting = false;
          timeout = setTimeout(animate, pauseAtStart);
          return;
        }

        timeout = setTimeout(animate, deleteSpeed);
      }
    };

    animate();

    return () => clearTimeout(timeout);
  }, []);
  const totalValue = portfolio.reduce(
    (total, item) => total + item.value,
    0
  );

  let currentAngle = 0;

  const donutGradient = portfolio
    .map((item) => {
      const percentage =
        (item.value / totalValue) * 100;

      const start = currentAngle;
      const end = currentAngle + percentage;

      currentAngle = end;

      return `${item.color} ${start}% ${end}%`;
    })
    .join(", ");
  const totalPerformance = portfolio.reduce(
    (total, item) => {
      return total + (item.value / 100) * item.performance[period];
    },
    0
  );

  return (
    <main className="site">

      {/* =========================
          BACKGROUND VIDEO
      ========================== */}

      <video
        ref={videoRef}
        className="background-video"
        src="/background.mp4"
        muted
        loop
        playsInline
        preload="auto"
      />

      <div className="background-overlay" />

      {/* =========================
          AUDIO
      ========================== */}

      <audio
        ref={audioRef}
        src="/bgm.mp3"
        loop
        preload="auto"
      />

      {/* =========================
          ENTER SCREEN
      ========================== */}

      {!entered && (
        <div
          className="enter-screen"
          onClick={enterSite}
        >
          <div className="enter-button">
            ENTER
          </div>
        </div>
      )}

      {/* =========================
          MAIN CONTENT
      ========================== */}

      <div
        className={`content ${
          entered ? "visible" : ""
        }`}
      >

        {/* =========================
            PROFILE
        ========================== */}

        <section className="profile">

          <div className="profile-image">
            <img
              src="/profile.jpg"
              alt="SpaceMan"
            />
          </div>

          <h1>
            SpaceMan
          </h1>

          <p className="username">
            @smts_0405
          </p>

        </section>

        {/* =========================
            SOCIALS
        ========================== */}

        <section className="socials">

          {/* Instagram */}

          <a
            href="https://www.instagram.com/smts_0405/"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            aria-label="Instagram"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <circle
                cx="12"
                cy="12"
                r="4.2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              />

              <circle
                cx="17.4"
                cy="6.7"
                r="1.2"
                fill="currentColor"
              />
            </svg>
          </a>

          {/* TikTok */}

          <a
            href="https://www.tiktok.com/@souma.__.j"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            aria-label="TikTok"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M15.5 3c.3 2.6 1.8 4.1 4.5 4.3v3.1c-1.6.1-3-.4-4.4-1.2v6.7c0 4.1-2.7 6.1-5.7 6.1-3 0-5.4-2-5.4-5.2 0-3.3 2.7-5.5 6.1-5.2v3.2c-1.7-.3-2.8.5-2.8 1.9 0 1.1.8 2 2 2 1.3 0 2.5-.8 2.5-2.8V3h3.2z"
                fill="currentColor"
              />
            </svg>
          </a>

          {/* Discord */}

          <a
            href="http://discordapp.com/users/898872229062934569"
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon"
            aria-label="Discord"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M19.5 5.1A16.2 16.2 0 0 0 15.6 4l-.5 1.1a14.5 14.5 0 0 0-6.2 0L8.4 4a16.2 16.2 0 0 0-3.9 1.1C2 8.5 1.3 12 1.6 15.5a16 16 0 0 0 4.8 2.4l1.2-1.6c-.7-.3-1.3-.6-1.9-1 .2-.1.4-.2.6-.4 3.7 1.7 7.7 1.7 11.4 0 .2.1.4.3.6.4-.6.4-1.2.7-1.9 1l1.2 1.6a16 16 0 0 0 4.8-2.4c.4-4.1-.7-7.5-2.9-10.4ZM8.7 14.1c-1.1 0-2-1-2-2.2s.9-2.2 2-2.2 2 1 2 2.2-.9 2.2-2 2.2Zm6.6 0c-1.1 0-2-1-2-2.2s.9-2.2 2-2.2 2 1 2 2.2-.9 2.2-2 2.2Z"
                fill="currentColor"
              />
            </svg>
          </a>

        </section>

        {/* =========================
            PORTFOLIO
        ========================== */}

        <section className="portfolio">

          <div className="portfolio-card">
            <div className="portfolio-heading">
              <span>ASSET PORTFOLIO</span>
            </div>

            {/* DONUT */}

            <div
              className="donut"
              style={{
                background: `conic-gradient(${donutGradient})`,
              }}
            >
              <div className="donut-center">
                <span className="donut-label">TOTAL</span>

                <span
                  className={`donut-performance ${
                    totalPerformance > 0
                      ? "positive"
                      : totalPerformance < 0
                      ? "negative"
                      : "neutral"
                  }`}
                >
                  {totalPerformance > 0 ? "+" : ""}
                  {totalPerformance.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* PORTFOLIO INFORMATION */}

            <div className="portfolio-info">

              {portfolio.map((item) => {

                const change =
                  item.performance[period];

                const performanceClass =
                  change > 0
                    ? "positive"
                    : change < 0
                    ? "negative"
                    : "neutral";

                return (
                  <div
                    className="portfolio-item"
                    key={item.name}
                  >

                    <div className="portfolio-left">

                      <span className="portfolio-name">
                        {item.name}
                      </span>

                      <span className="portfolio-weight">
                        {item.value}%
                      </span>

                    </div>

                    <span
                      key={`${item.name}-${period}`}
                      className={`portfolio-performance ${performanceClass}`}
                    >
                      {change > 0
                        ? "+"
                        : ""}

                      {change.toFixed(2)}%
                    </span>

                  </div>
                );
              })}

              {/* PERIOD SELECTOR */}

              <div className="period-selector">

                {periods.map((item) => (

                  <button
                    key={item}
                    className={
                      period === item
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setPeriod(item)
                    }
                  >
                    {item}
                  </button>

                ))}

              </div>

            </div>

          </div>

        </section>

        {/* =========================
            SOUND BUTTON
        ========================== */}

        <button
          className={`sound-button ${
            soundOn ? "active" : ""
          }`}
          onClick={toggleSound}
          aria-label={
            soundOn
              ? "Turn sound off"
              : "Turn sound on"
          }
        >
          {soundOn ? "♪" : "×"}
        </button>

      </div>

    </main>
  );
}