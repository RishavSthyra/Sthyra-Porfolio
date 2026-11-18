import StaggeredMenu from "@/components/ui/StaggeredMenu";

const menuItems = [
  { label: "Portfolio", ariaLabel: "View all projects", link: "/portfolio" },
  {
    label: "Trifecta",
    ariaLabel: "View Trifecta Veranza",
    link: "/portfolio/trifecta-veranza",
  },
  {
    label: "Tula",
    ariaLabel: "View Tula Whisper of Trees",
    link: "/portfolio/tula-whisper-of-trees",
  },
  {
    label: "Aadhya",
    ariaLabel: "View Aadhya Serene",
    link: "/portfolio/aadhya-serene",
  },
];

const socialItems = [
  {
    label: "Instagram",
    link: "https://www.instagram.com/sthyrastudios?stkn=OGF3dzJudWc5c211",
  },
  {
    label: "LinkedIn",
    link: "https://linkedin.com/company/sthyra/?originalSubdomain=in",
  },
];

export default function PortfolioNavigation() {
  return (
    <StaggeredMenu
      position="right"
      items={menuItems}
      socialItems={socialItems}
      displaySocials
      displayItemNumbering={false}
      menuButtonColor="#ffffff"
      openMenuButtonColor="#ffffff"
      changeMenuColorOnOpen
      colors={["#d8d5cd", "#aaa69c", "#77736c"]}
      logoUrl="/sthyra-studios-logo-white.png"
      accentColor="#ffffff"
      className="mix-blend-difference"
      isFixed
    />
  );
}
