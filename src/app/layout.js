import "@/styles/globals.css";
import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";

import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans"
});

const fontWarzone = localFont({
  src: "../fonts/HitmarkerText-VF.woff2",
  variable: "--font-warzone"
});

export const metadata = {
  title: "Warzone Drop Randomizer",
  description: "A customizable drop location randomizer for warzone!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={cn("bg-background font-sans antialiased", fontSans.variable, fontWarzone.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
