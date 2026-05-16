import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { LanguageProvider } from "@/lib/LanguageContext";
import "./globals.css";

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "400", "800"],
});

export const metadata: Metadata = {
  title: "Jasan Badell | Frontend Engineer",
  description: "Portfolio de Jasan Badell, Frontend Engineer especializado en interfaces modernas, accesibles y de alto rendimiento.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body className={jetBrainsMono.className}>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
