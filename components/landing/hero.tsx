"use client";
import { useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { BookingWidget } from "./booking-widget";
import { useHeroReveal, useParallax } from "@/lib/hooks/useScrollAnimation";

const HEADLINE = ["Un santuario privado", "frente al horizonte"];

export function Hero() {
  useHeroReveal("#hm-hero");
  useParallax("#hm-hero-img", 25);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  const words = HEADLINE.flatMap((line) => [...line.split(" "), "\n"]).slice(0, -1);

  const isLineBreak = (w: string) => w === "\n";

  return (
    <section id="hm-hero" className="relative w-full h-[100svh] min-h-[640px] overflow-hidden">
      {/* Background layer */}
      <div className="absolute inset-0 overflow-hidden">
        <div id="hm-hero-img" className="absolute -inset-y-[15%] inset-x-0 will-change-transform">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover opacity-75"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-[var(--color-bg)]" />
        <div className="absolute inset-0 gradient-radial-gold opacity-60" />
      </div>

      {/* Content */}
      <div className="container-x relative z-10 h-full flex flex-col items-center justify-center text-center pt-40 md:pt-28 pb-16">
        <p className="eyebrow mb-7">HoneyMoon · Hotel &amp; Spa</p>

        <h1 className="font-display text-white font-light max-w-5xl text-balance text-[clamp(2.25rem,6.2vw,5.75rem)] leading-[1.08]">
          {words.map((w, i) =>
            isLineBreak(w) ? (
              <span key={i} className="block" />
            ) : (
              <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.22em]">
                <span data-word className="inline-block">
                  {w}
                </span>
              </span>
            )
          )}
        </h1>

        <p className="mt-8 max-w-xl text-white/75 text-base md:text-lg leading-relaxed">
          Cinco habitaciones de carácter, una sola filosofía:
        </p>
        <p className="text-white/75 text-base md:text-lg leading-relaxed -mt-2">
          vivir el lujo sin perder el alma del lugar.
        </p>

        <div className="mt-12 w-full flex justify-center">
          <BookingWidget />
        </div>
      </div>

      <a
        href="#intro"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex flex-col items-center gap-2 text-white/60 hover:text-[var(--color-primary)] transition z-10"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown className="animate-bounce" size={18} />
      </a>
    </section>
  );
}
