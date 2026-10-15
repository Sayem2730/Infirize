import type { Metadata } from "next";
import { Space_Grotesk, Inter, Outfit } from "next/font/google";
import SmoothScroll from "./components/SmoothScroll";
import Header from "./components/Header";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "InfirizeTech",
  description: "InfirizeTech builds websites and software that last.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${outfit.variable}`}
    >
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:bg-white focus:p-3"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Header />
          <main id="main">{children}</main>
        </SmoothScroll>
      </body>
    </html>
  );
}
