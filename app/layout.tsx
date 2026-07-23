import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const urbanist = localFont({
  src: "../public/fonts/Urbanist/Urbanist-VariableFont_wght.ttf",
  variable: "--nf-urbanist",
  weight: "100 900",
});

const inter = localFont({
  src: "../public/fonts/Inter/Inter-VariableFont.ttf",
  variable: "--nf-inter",
  weight: "100 900",
});

const manrope = localFont({
  src: "../public/fonts/Manrope/Manrope-VariableFont_wght.ttf",
  variable: "--nf-manrope",
  weight: "200 800",
});

const googleSansFlex = localFont({
  src: "../public/fonts/Google_Sans_Flex/GoogleSansFlex-VariableFont.ttf",
  variable: "--nf-google-sans-flex",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "codedbysahil",
  description: "Developer & designer — mobile, web, and product.",
  icons: {
    icon: "/images/favIcon.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${urbanist.variable} ${inter.variable} ${manrope.variable} ${googleSansFlex.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-full bg-background text-text-primary">
        {children}
      </body>
    </html>
  );
}
