"use client";
import { useEffect } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { BookingWidget } from "./booking-widget";
import { useHeroReveal, useParallax } from "@/lib/hooks/useScrollAnimation";

const HEADLINE = "Donde el océano se convierte en tu hogar";

export function Hero() {
  useHeroReveal("#hm-hero");
  useParallax("#hm-hero-img", 25);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  const words = HEADLINE.split(" ");

  return (
    <section id="hm-hero" className="relative h-[100dvh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <div id="hm-hero-img" className="absolute inset-0 -top-[15%] h-[130%]">
          <Image
            src="https://picsum.photos/seed/honeymoon-hero/2400/1600"
            alt="HoneyMoon Hotel"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-[var(--color-bg)]" />
        <div className="absolute inset-0 gradient-radial-gold opacity-60" />
      </div>

      <div className="relative h-full w-full flex flex-col items-center justify-center px-6 text-center pt-24">
        <p className="text-[11px] uppercase tracking-[0.5em] text-[var(--color-primary)]/80 mb-6">
          HoneyMoon · Hotel & Spa
        </p>
        <h1 className="font-display text-[clamp(2.5rem,7vw,6.5rem)] leading-[1.02] font-light text-white max-w-5xl text-balance">
          {words.map((w, i) => (
            <span key={i} className="inline-block overflow-hidden align-bottom mr-[0.25em]">
              <span data-word className="inline-block">{w}</span>
            </span>
          ))}
        </h1>
        <p className="mt-6 max-w-xl text-white/70 text-base md:text-lg leading-relaxed">
          Cinco habitaciones de carácter, una sola filosofía: vivir el lujo sin perder el alma del lugar.
        </p>

        <div className="mt-10 w-full flex justify-center px-2">
          <BookingWidget />
        </div>
      </div>

      <a
        href="#intro"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex flex-col items-center gap-2 text-white/60 hover:text-[var(--color-primary)] transition"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <ChevronDown className="animate-bounce" size={18} />
      </a>
    </section>
  );
}
