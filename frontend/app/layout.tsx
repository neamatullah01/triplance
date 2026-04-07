import { Geist, Geist_Mono, IBM_Plex_Sans, Noto_Serif } from "next/font/google"

import "./globals.css"
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Metadata } from "next";


const notoSerifHeading = Noto_Serif({subsets:['latin'],variable:'--font-heading'});

const ibmPlexSans = IBM_Plex_Sans({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Triplance | Explore the World",
  description: "A Full-Stack Travel Social & Booking Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", ibmPlexSans.variable, notoSerifHeading.variable)}
    >
      <body suppressHydrationWarning={true}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
