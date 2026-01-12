import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brajesh Parte | Elite Personal Training",
  description: "Optimizing human potential through disciplined training and expert guidance. Professional Personal Trainer based in Lakhnadon.",
  keywords: ["bodybuilder", "fitness", "personal training", "coaching", "Brajesh Parte", "Lakhnadon fitness"],
  openGraph: {
    title: "Brajesh Parte | Elite Personal Training",
    description: "Optimizing human potential through disciplined training and expert guidance.",
    url: "https://brajeshparte.com",
    siteName: "Brajesh Parte Fitness",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brajesh Parte | Elite Personal Training",
    description: "Optimizing human potential through disciplined training and expert guidance.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${outfit.variable} ${inter.variable} font-body bg-[#050505] text-white selection:bg-primary selection:text-black`}
      >
        {/* Children */}
        {children}
      </body>
    </html>
  );
}
