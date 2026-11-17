import type { Metadata } from "next";
import PortfolioIndexExperience from "@/components/portfolio/PortfolioIndexExperience";

export const metadata: Metadata = {
  title: "Our Projects",
  description:
    "A selection of architectural stories shaped through imagery, interaction, and immersive digital experiences.",
};

export default function PortfolioPage() {
  return <PortfolioIndexExperience />;
}
