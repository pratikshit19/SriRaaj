import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/CartContext";
import { AuthProvider } from "@/lib/AuthContext";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sriraaj.in'),
  title: {
    default: "SRIRAAJ — Pure Indian Goodness",
    template: "%s | SRIRAAJ",
  },
  description: "Premium traditional Indian food products. A2 Cow Ghee, Cold-Pressed Mustard Oil, Cold-Pressed Groundnut Oil and more. Pure Indian Goodness.",
  keywords: ["A2 cow ghee", "cold pressed mustard oil", "cold pressed groundnut oil", "traditional Indian food", "premium Indian pantry", "SRIRAAJ"],
  openGraph: {
    type: "website",
    siteName: "SRIRAAJ",
    title: "SRIRAAJ — Pure Indian Goodness",
    description: "Rooted in India's food traditions, made for the way we cook today.",
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <AuthProvider>
          <CartProvider>
            <Header />
            <main style={{ paddingTop: 80 }}>
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
