import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import LenisProvider from "@/components/providers/LenisProvider";

const onest = Onest({
  subsets: ["latin"],
  weight: "variable",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sthyra Portfolio",
    template: "%s | Sthyra Portfolio",
  },
  description:
    "Selected architectural stories presented through imagery, interaction, and immersive digital experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={onest.className}>
      <body>
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
