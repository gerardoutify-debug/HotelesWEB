import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HoneyMoon Hotel — Donde el océano se convierte en tu hogar",
    template: "%s · HoneyMoon Hotel",
  },
  description:
    "Hotel boutique 5 estrellas frente al Pacífico. Suites románticas, habitaciones de lujo y la experiencia HoneyMoon: gastronomía, spa y vistas inolvidables.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  openGraph: {
    title: "HoneyMoon Hotel",
    description: "Donde el océano se convierte en tu hogar.",
    type: "website",
    locale: "es_PE",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${cormorant.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
