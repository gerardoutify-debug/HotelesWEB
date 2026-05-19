"use client";
import { useEffect } from "react";

let registered = false;
let GSAP: typeof import("gsap").gsap | null = null;
let ST: typeof import("gsap/ScrollTrigger").ScrollTrigger | null = null;

async function ensureGsap() {
  if (typeof window === "undefined") return null;
  if (registered && GSAP && ST) return { gsap: GSAP, ScrollTrigger: ST };
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  GSAP = gsap;
  ST = ScrollTrigger;
  registered = true;
  return { gsap, ScrollTrigger };
}

export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useHeroReveal(targetSelector: string) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cleanup = () => {};
    (async () => {
      const lib = await ensureGsap();
      if (!lib) return;
      const { gsap } = lib;
      const words = document.querySelectorAll(`${targetSelector} [data-word]`);
      const tween = gsap.fromTo(
        words,
        { y: 60, opacity: 0, filter: "blur(8px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.08,
          duration: 1.1,
          ease: "power3.out",
          delay: 0.2,
        }
      );
      cleanup = () => {
        tween.kill();
      };
    })();
    return () => cleanup();
  }, [targetSelector]);
}

export function useParallax(selector: string, intensity = 30) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cleanup = () => {};
    (async () => {
      const lib = await ensureGsap();
      if (!lib) return;
      const { gsap, ScrollTrigger } = lib;
      const el = document.querySelector(selector);
      if (!el) return;
      const tween = gsap.to(el, {
        yPercent: intensity,
        ease: "none",
        scrollTrigger: { trigger: el.parentElement ?? el, start: "top top", end: "bottom top", scrub: true },
      });
      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
      ScrollTrigger.refresh();
    })();
    return () => cleanup();
  }, [selector, intensity]);
}

export function useHorizontalScroll(containerId: string, trackId: string) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cleanup = () => {};
    (async () => {
      const lib = await ensureGsap();
      if (!lib) return;
      const { gsap, ScrollTrigger } = lib;
      const container = document.getElementById(containerId);
      const track = document.getElementById(trackId);
      if (!container || !track) return;
      const distance = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
      ScrollTrigger.refresh();
    })();
    return () => cleanup();
  }, [containerId, trackId]);
}

export function useWordReveal(selector: string) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cleanup = () => {};
    (async () => {
      const lib = await ensureGsap();
      if (!lib) return;
      const { gsap } = lib;
      const words = document.querySelectorAll(`${selector} [data-w]`);
      const tween = gsap.fromTo(
        words,
        { opacity: 0.15, y: 14 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: selector,
            start: "top 80%",
            end: "bottom 40%",
            scrub: 0.4,
          },
        }
      );
      cleanup = () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    })();
    return () => cleanup();
  }, [selector]);
}

export function useCounter(selector: string) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cleanup = () => {};
    (async () => {
      const lib = await ensureGsap();
      if (!lib) return;
      const { gsap } = lib;
      const els = document.querySelectorAll<HTMLElement>(selector);
      const tweens: gsap.core.Tween[] = [];
      els.forEach((el) => {
        const target = parseFloat(el.dataset.target ?? "0");
        const t = gsap.fromTo(
          el,
          { textContent: 0 },
          {
            textContent: target,
            duration: 2,
            ease: "power2.out",
            snap: { textContent: 1 },
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
        tweens.push(t);
      });
      cleanup = () => {
        tweens.forEach((t) => {
          t.scrollTrigger?.kill();
          t.kill();
        });
      };
    })();
    return () => cleanup();
  }, [selector]);
}

export function useClipReveal(selector: string) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cleanup = () => {};
    (async () => {
      const lib = await ensureGsap();
      if (!lib) return;
      const { gsap } = lib;
      const els = document.querySelectorAll(selector);
      const tweens: gsap.core.Tween[] = [];
      els.forEach((el) => {
        const t = gsap.fromTo(
          el,
          { clipPath: "inset(100% 0 0 0)" },
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );
        tweens.push(t);
      });
      cleanup = () => {
        tweens.forEach((t) => {
          t.scrollTrigger?.kill();
          t.kill();
        });
      };
    })();
    return () => cleanup();
  }, [selector]);
}
