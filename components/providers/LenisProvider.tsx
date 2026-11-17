"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useResponsiveScale from "@/hooks/useResponsiveScale";

type LenisProviderProps = {
  children: ReactNode;
};

export default function LenisProvider({ children }: LenisProviderProps) {
  useResponsiveScale();
  const pathname = usePathname();

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1025px) and (pointer: fine)");
    const isAmenityPortfolio =
      pathname === "/portfolio/tula-whisper-of-trees" ||
      pathname === "/portfolio/aadhya-serene" ||
      pathname === "/portfolio/trifecta-veranza";

    if (!desktopQuery.matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      autoRaf: false,
      content: document.body,
      duration: isAmenityPortfolio ? 1.32 : 1.08,
      smoothWheel: true,
      stopInertiaOnNavigate: true,
      wheelMultiplier: isAmenityPortfolio ? 0.8 : 0.94,
      touchMultiplier: 1,
      prevent: (node) =>
        node.closest(
          ".site-horizontal-scroll, .mobile-transition-carousel, .portfolio-option-wheel",
        ) !== null,
      easing: (value) => 1 - Math.pow(1 - value, isAmenityPortfolio ? 4 : 3),
    });

    let frame = 0;
    let resizeFrame = 0;

    const update = (time: number) => {
      lenis.raf(time);
      frame = window.requestAnimationFrame(update);
    };

    const handleRefresh = () => {
      lenis.resize();
    };

    lenis.on("scroll", ScrollTrigger.update);
    frame = window.requestAnimationFrame(update);
    ScrollTrigger.addEventListener("refresh", handleRefresh);
    resizeFrame = window.requestAnimationFrame(() => {
      resizeFrame = window.requestAnimationFrame(() => {
        lenis.resize();
        ScrollTrigger.refresh();
      });
    });

    return () => {
      ScrollTrigger.removeEventListener("refresh", handleRefresh);

      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }

      if (resizeFrame !== 0) {
        window.cancelAnimationFrame(resizeFrame);
      }

      lenis.destroy();
    };
  }, [pathname]);

  return children;
}
