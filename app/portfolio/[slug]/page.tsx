import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectStoryExperience from "@/components/portfolio/ProjectStoryExperience";
import {
  PORTFOLIO_STORIES,
  getNextPortfolioStory,
  getPortfolioStory,
} from "@/lib/portfolio-projects";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return PORTFOLIO_STORIES.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getPortfolioStory(slug);

  if (!project) return {};

  return {
    title: project.name,
    description: project.overview,
    openGraph: {
      title: `${project.name} | Sthyra Portfolio`,
      description: project.overview,
      images: [{ url: project.heroImage }],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getPortfolioStory(slug);

  if (!project) notFound();

  return (
    <ProjectStoryExperience
      project={project}
      nextProject={getNextPortfolioStory(project.slug)}
    />
  );
}
