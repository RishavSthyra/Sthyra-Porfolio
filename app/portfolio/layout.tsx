import PortfolioNavigation from "@/components/portfolio/PortfolioNavigation";

export default function PortfolioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-black text-white">
      <PortfolioNavigation />
      {children}
    </div>
  );
}
