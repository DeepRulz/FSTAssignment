import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { CartBadge } from "@/components/cart-badge";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Assignment 1 - Accessible Primitives, Zustand & Server Actions",
  description: "Next.js App Router project demonstrating theme hydration, RSC serialization, Zustand store, and Server Actions with Zod.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
            <div className="container mx-auto flex h-14 items-center justify-between px-4 max-w-5xl">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight">Assignment 1 App</span>
              </div>
              <div className="flex items-center gap-3">
                <CartBadge />
                <ThemeToggle />
              </div>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8 max-w-5xl">
            {children}
          </main>
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
