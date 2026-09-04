import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "AlFasle — Plateforme de Gestion de Classes, Cours & Devoirs",
  description:
    "Créez vos classes, validez les préinscriptions, publiez vos cours et vidéos, donnez des devoirs et corrigez-les au même endroit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <body className="antialiased min-h-screen bg-[#090d16] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
