"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { FiArrowUpRight } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HomePageFooter from "@/components/HomePageFooter";
import { AADHYA_AMENITY_VIDEOS } from "@/lib/aadhya-portfolio-media";
import type { PortfolioVideo } from "@/lib/portfolio-media";
import type { PortfolioStory } from "@/lib/portfolio-projects";
import { TRIFECTA_AMENITY_VIDEOS } from "@/lib/trifecta-portfolio-media";
import {
  TULA_AMENITY_VIDEOS,
  TULA_TRAILER,
} from "@/lib/tula-portfolio-media";

type ProjectStoryExperienceProps = {
  project: PortfolioStory;
  nextProject: PortfolioStory;
};

const PROJECT_COVER_IMAGES: Record<string, string> = {
  "trifecta-veranza": "/portfolio_new/Trifecta-02.avif",
  "tula-whisper-of-trees": "/portfolio_new/Tula_1.avif",
  "aadhya-serene": "/portfolio_new/AS-1.avif",
};

export default function ProjectStoryExperience({
  project,
  nextProject,
}: ProjectStoryExperienceProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const entranceRef = useRef<HTMLDivElement | null>(null);
  const exitRef = useRef<HTMLDivElement | null>(null);
  const exitLabelRef = useRef<HTMLParagraphElement | null>(null);
  const isLeavingRef = useRef(false);
  const router = useRouter();
  const isTula = project.slug === "tula-whisper-of-trees";
  const isAadhya = project.slug === "aadhya-serene";
  const isTrifecta = project.slug === "trifecta-veranza";
  const hasAmenityFilms = isTula || isAadhya || isTrifecta;
  const coverImage = PROJECT_COVER_IMAGES[project.slug] ?? project.heroImage;
  const nextCoverImage =
    PROJECT_COVER_IMAGES[nextProject.slug] ?? nextProject.heroImage;
  const projectVideos: PortfolioVideo[] = isTula
    ? TULA_AMENITY_VIDEOS
    : isAadhya
      ? AADHYA_AMENITY_VIDEOS
      : isTrifecta
        ? TRIFECTA_AMENITY_VIDEOS
        : project.cinematicVideo
          ? [
              {
                title: project.name,
                videoSrc: project.cinematicVideo,
                posterSrc: project.cinematicImage,
              },
            ]
          : [];

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .to(entranceRef.current, {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.9,
            ease: "expo.inOut",
          })
          .from(
            "[data-project-title]",
            { opacity: 0, y: 28, duration: 0.9 },
            0.34,
          )
          .from(
            "[data-project-meta]",
            { opacity: 0, y: 14, duration: 0.6 },
            0.48,
          );

        gsap.utils
          .toArray<HTMLElement>("[data-project-frame]")
          .forEach((frame) => {
            gsap.from(frame, {
              opacity: 0,
              y: 36,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: frame,
                start: "top 88%",
                once: true,
              },
            });
          });

        gsap.from("[data-next-work]", {
          opacity: 0,
          y: 28,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-next-work]",
            start: "top 84%",
            once: true,
          },
        });
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(entranceRef.current, { display: "none" });
      });
    }, rootRef);

    return () => {
      media.revert();
      context.revert();
    };
  }, [project.slug]);

  const navigateWithTransition = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
    label: string,
  ) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    event.preventDefault();
    if (isLeavingRef.current) return;
    isLeavingRef.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(href);
      return;
    }

    if (exitLabelRef.current) exitLabelRef.current.textContent = label;
    gsap.set(exitRef.current, {
      display: "flex",
      clipPath: "inset(100% 0 0 0)",
    });

    gsap
      .timeline()
      .to(exitRef.current, {
        clipPath: "inset(0% 0 0 0)",
        duration: 0.85,
        ease: "expo.inOut",
      })
      .fromTo(
        exitLabelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.38, ease: "power3.out" },
        0.43,
      )
      .call(() => router.push(href), [], 0.76);
  };

  return (
    <main
      ref={rootRef}
      className="min-h-screen overflow-x-clip bg-black text-white"
    >
      <section className="relative h-[100svh] w-full overflow-hidden bg-black">
        {isTula ? (
          <LazyPortfolioVideo
            video={TULA_TRAILER}
            eager
            className="absolute inset-0"
          />
        ) : (
          <Image
            src={coverImage}
            alt={`${project.name} architectural overview`}
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,transparent_42%,rgba(0,0,0,0.72)_100%)]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1]"
          style={{
            height: "44svh",
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 44%, #000 100%)",
          }}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 px-4 pb-8 sm:px-8 sm:pb-10 lg:px-10 lg:pb-12">
          <p
            data-project-meta
            className="mb-5 mt-0 font-mono text-[0.68rem] tracking-[0.04em] text-white/68 sm:text-[0.76rem]"
          >
            {project.location} / {project.acreage} / {project.year}
          </p>
          <h1
            data-project-title
            className="m-0 max-w-[15ch] text-[clamp(3rem,7.4vw,8rem)] font-semibold leading-[0.84] tracking-[-0.075em]"
          >
            {project.name}
          </h1>
        </div>
      </section>

      <section
        aria-label={`${project.name} project films`}
        className="bg-black pb-[14svh] pt-[8svh]"
      >
        <div className="flex min-h-[72svh] items-center justify-center px-5 text-center sm:px-8">
          <div className="max-w-[62rem]">
            <p className="m-0 font-mono text-[0.7rem] tracking-[0.08em] text-white/42">
              {hasAmenityFilms ? "Spaces in motion" : project.eyebrow}
            </p>
            <h2 className="mb-0 mt-7 text-balance text-[clamp(2.1rem,4.2vw,4.8rem)] font-semibold leading-[0.94] tracking-[-0.06em]">
              {project.statement}
            </h2>
          </div>
        </div>

        {projectVideos.map((video) => (
          <figure
            key={video.videoSrc}
            className="m-0 flex w-full items-center"
            style={{ minHeight: "115svh" }}
          >
            <div
              data-project-frame
              className="relative overflow-hidden bg-[#080808]"
              style={{ width: "100vw", height: "100svh" }}
            >
              <LazyPortfolioVideo video={video} />
              <figcaption className="sr-only">{video.title}</figcaption>
            </div>
          </figure>
        ))}

        <section
          className="flex w-full items-center"
          style={{ minHeight: "115svh" }}
        >
          <div className="w-full">
            <a
              data-project-frame
              href={project.webAppUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open the ${project.name} web app in a new tab`}
              className="group relative block overflow-hidden bg-[#080808] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              style={{ width: "100vw", height: "100svh" }}
            >
              <Image
                src={project.webAppImage}
                alt={`${project.name} interactive web app`}
                fill
                sizes="(max-width: 768px) 100vw, 98vw"
                unoptimized={project.webAppImage.startsWith("http")}
                className="object-cover"
              />
              <span className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center bg-white text-black transition-transform duration-500 group-hover:rotate-45 sm:bottom-6 sm:right-6 sm:h-13 sm:w-13">
                <FiArrowUpRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </a>
          </div>
        </section>
      </section>

      <section className="relative flex min-h-[100svh] items-center justify-center bg-black px-4 py-28 sm:px-8">
        <Link
          data-next-work
          href={`/portfolio/${nextProject.slug}`}
          onClick={(event) =>
            navigateWithTransition(
              event,
              `/portfolio/${nextProject.slug}`,
              nextProject.name,
            )
          }
          className="group block w-full max-w-[48rem] focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-white"
        >
          <p className="mb-5 mt-0 flex items-center gap-3 font-mono text-[clamp(0.75rem,1.1vw,1rem)] tracking-[-0.02em] text-white/86">
            <span aria-hidden="true" className="text-[0.66em]">
              ▶
            </span>
            <span className="border-b border-transparent pb-1 transition-colors duration-300 group-hover:border-white/70">
              Next work — {nextProject.name}
            </span>
          </p>
          <div className="relative aspect-video w-full overflow-hidden bg-[#080808]">
            <Image
              src={nextCoverImage}
              alt={`View next project: ${nextProject.name}`}
              fill
              sizes="(max-width: 768px) 92vw, 768px"
              className="object-contain"
            />
          </div>
        </Link>

        <div className="absolute bottom-8 left-4 font-mono text-[0.7rem] leading-[1.55] text-white/42 sm:left-8 lg:left-10">
          <p className="m-0">© Sthyra Studios</p>
          <p className="m-0">Bangalore</p>
        </div>
      </section>

      <HomePageFooter />

      <div
        ref={entranceRef}
        className="pointer-events-none fixed inset-0 z-[130] bg-black"
        aria-hidden="true"
      />

      <div
        ref={exitRef}
        className="fixed inset-0 z-[140] hidden items-center justify-center bg-black px-6 text-white"
        aria-hidden="true"
      >
        <p
          ref={exitLabelRef}
          className="m-0 max-w-[14ch] text-center text-[clamp(2.8rem,7vw,7rem)] font-semibold leading-[0.86] tracking-[-0.07em]"
        />
      </div>
    </main>
  );
}

type LazyPortfolioVideoProps = {
  video: PortfolioVideo;
  eager?: boolean;
  className?: string;
};

function LazyPortfolioVideo({
  video,
  eager = false,
  className = "absolute inset-0",
}: LazyPortfolioVideoProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const isInViewRef = useRef(eager);
  const [shouldLoad, setShouldLoad] = useState(eager);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || eager) return;

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        loadObserver.disconnect();
      },
      { rootMargin: "700px 0px" },
    );

    loadObserver.observe(container);
    return () => loadObserver.disconnect();
  }, [eager]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const playbackObserver = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
        const element = videoRef.current;
        if (!element) return;

        if (entry.isIntersecting) {
          void element.play().catch(() => undefined);
        } else {
          element.pause();
        }
      },
      { threshold: 0.18 },
    );

    playbackObserver.observe(container);
    return () => playbackObserver.disconnect();
  }, [shouldLoad]);

  const markReady = () => {
    setIsReady(true);
    if (isInViewRef.current) {
      void videoRef.current?.play().catch(() => undefined);
    }
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: "100%", height: "100%" }}
    >
      <Image
        src={video.posterSrc}
        alt=""
        fill
        preload={eager}
        sizes="100vw"
        unoptimized
        aria-hidden="true"
        className={`object-cover transition-opacity duration-500 ${
          isReady ? "opacity-0" : "opacity-100"
        }`}
      />
      {shouldLoad ? (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          autoPlay
          preload={eager ? "auto" : "metadata"}
          poster={video.posterSrc}
          aria-label={`${video.title} film`}
          onLoadedData={markReady}
          onCanPlay={markReady}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            isReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <source src={video.videoSrc} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
