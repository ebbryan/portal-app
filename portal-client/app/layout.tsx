import { Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { cn } from "../lib/utils"
import { ThemeProvider } from "../components/theme-provider"
import { Toaster } from "../components/ui/sonner"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata = {
  title: "Portal - Neu Breed Creatives",
  description:
    "Portal is a powerful tool for managing your creative projects, providing a seamless experience for collaboration and organization. With its intuitive interface and robust features, Portal helps you stay on top of your work and bring your creative visions to life.",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <Toaster />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
