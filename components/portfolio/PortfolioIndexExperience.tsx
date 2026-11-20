"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type MouseEvent,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HomePageFooter from "@/components/HomePageFooter";

const PROJECTS = [
  {
    slug: "trifecta-veranza",
    image: "/portfolio_new/Trifecta-02.avif",
    name: "Trifecta",
    edition: "Veranza",
    alt: "Aerial view of the Trifecta Veranza residential towers and landscape",
    objectPosition: "center center",
    width: 3840,
    height: 2160,
  },
  {
    slug: "tula-whisper-of-trees",
    image: "/portfolio_new/Tula_1.avif",
    name: "Tula",
    edition: "Whisper of Trees",
    alt: "Aerial view of Tula Whisper of Trees surrounded by its landscape",
    objectPosition: "center center",
    width: 4798,
    height: 3041,
  },
  {
    slug: "aadhya-serene",
    image: "/portfolio_new/AS-1.avif",
    name: "Aadhya",
    edition: "Serene",
    alt: "Aerial view of Aadhya Serene among mature trees at dusk",
    objectPosition: "center 46%",
    width: 3700,
    height: 2314,
  },
] as const;

type Project = (typeof PROJECTS)[number];

function ProjectPanel({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (event: MouseEvent<HTMLAnchorElement>, project: Project) => void;
}) {
  return (
    <article
      data-project-panel
      style={{ zIndex: index + 1 }}
      className="relative w-full bg-[#111] xl:sticky xl:top-0 xl:h-[100svh] xl:overflow-hidden"
    >
      <Link
        href={`/portfolio/${project.slug}`}
        onClick={(event) => onOpen(event, project)}
        aria-label={`Explore ${project.name} ${project.edition}`}
        className="group relative block w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-[-5px] focus-visible:outline-white xl:absolute xl:inset-0"
      >
        <div
          className="relative aspect-[var(--project-aspect)] w-full xl:absolute xl:inset-0 xl:aspect-auto"
          style={
            {
              "--project-aspect": `${project.width} / ${project.height}`,
            } as CSSProperties
          }
        >
          <Image
            src={project.image}
            alt={project.alt}
            fill
            sizes="100vw"
            quality={90}
            style={{ objectPosition: project.objectPosition }}
            className="object-contain xl:object-cover"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.22)_0%,transparent_28%,transparent_66%,rgba(0,0,0,0.22)_100%)]" />

        <div
          data-project-labels
          className="pointer-events-none absolute inset-0 flex items-center justify-between gap-8 px-4 text-white sm:px-7 lg:px-9"
        >
          <h2
            style={{ fontSize: "clamp(1.6rem, 2.2vw, 2.75rem)" }}
            className="m-0 font-semibold leading-none tracking-[-0.045em] drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)]"
          >
            {project.name}
          </h2>
          <p
            style={{ fontSize: "clamp(1.6rem, 2.2vw, 2.75rem)" }}
            className="m-0 max-w-[13rem] text-right font-semibold leading-none tracking-[-0.045em] drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)] sm:max-w-none"
          >
            {project.edition}
          </p>
        </div>
      </Link>
    </article>
  );
}

export default function PortfolioIndexExperience() {
  const rootRef = useRef<HTMLElement | null>(null);
  const transitionRef = useRef<HTMLDivElement | null>(null);
  const transitionLabelRef = useRef<HTMLParagraphElement | null>(null);
  const isTransitioningRef = useRef(false);
  const router = useRouter();

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from("[data-hero-title]", {
            opacity: 0,
            y: 30,
            duration: 1.05,
          })
          .from(
            "[data-hero-description]",
            {
              opacity: 0,
              y: 20,
              duration: 0.85,
            },
            "-=0.68",
          );
      });

      media.add(
        "(min-width: 1280px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.utils
            .toArray<HTMLElement>("[data-project-panel]")
            .forEach((panel) => {
              const labels = panel.querySelector("[data-project-labels]");

              gsap.from(labels, {
                opacity: 0,
                y: 24,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: panel,
                  start: "top 72%",
                },
              });
            });
        },
      );
    }, rootRef);

    return () => {
      media.revert();
      context.revert();
    };
  }, []);

  const openProject = (
    event: MouseEvent<HTMLAnchorElement>,
    project: Project,
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
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      router.push(`/portfolio/${project.slug}`);
      return;
    }

    if (transitionLabelRef.current) {
      transitionLabelRef.current.textContent = `${project.name} ${project.edition}`;
    }

    gsap.set(transitionRef.current, {
      display: "flex",
      clipPath: "inset(100% 0 0 0)",
    });

    gsap
      .timeline()
      .to(transitionRef.current, {
        clipPath: "inset(0% 0 0 0)",
        duration: 0.85,
        ease: "expo.inOut",
      })
      .fromTo(
        transitionLabelRef.current,
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
        0.42,
      )
      .call(() => router.push(`/portfolio/${project.slug}`), [], 0.76);
  };

  return (
    <main ref={rootRef} className="min-h-screen overflow-x-clip bg-black text-white">
      <section className="relative grid min-h-[100svh] place-items-center px-5 py-32 sm:px-8">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center text-center">
          <h1
            data-hero-title
            style={{ fontSize: "clamp(3.2rem, 7.5vw, 8.25rem)" }}
            className="m-0 whitespace-nowrap font-semibold leading-[0.88] tracking-[-0.07em]"
          >
            Our projects
          </h1>
          <p
            data-hero-description
            className="mb-0 mt-8 max-w-[38rem] text-balance text-[clamp(0.95rem,1.35vw,1.25rem)] leading-[1.55] tracking-[-0.025em] text-white/62 sm:mt-10"
          >
            A selection of architectural stories shaped through imagery,
            interaction, and immersive digital experiences.
          </p>
        </div>
      </section>

      <section aria-label="Selected portfolio projects" className="relative isolate">
        {PROJECTS.map((project, index) => (
          <ProjectPanel
            key={project.slug}
            project={project}
            index={index}
            onOpen={openProject}
          />
        ))}
      </section>

      <HomePageFooter />

      <div
        ref={transitionRef}
        className="fixed inset-0 z-[120] hidden items-center justify-center bg-black px-6 text-white"
        aria-hidden="true"
      >
        <p
          ref={transitionLabelRef}
          className="m-0 max-w-[14ch] text-center text-[clamp(2.7rem,7vw,7rem)] font-semibold leading-[0.86] tracking-[-0.07em]"
        />
      </div>
    </main>
  );
}
