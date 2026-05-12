import type { Metadata } from "next";
import localFont from "next/font/local";
import CursorShell from "@/app/components/CursorShell";
import "./globals.css";

const ibmPlexSans = localFont({
  src: "../public/fonts/IBMPlexSans-Variable.ttf",
  variable: "--font-ibm-plex-sans",
  weight: "100 700",
});

const menlo = localFont({
  src: "../public/fonts/Menlo-Regular.ttf",
  variable: "--font-menlo",
  weight: "400",
});

export const metadata: Metadata = {
  title: "codedbysahil",
  description: "Developer & designer — mobile, web, and product.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmPlexSans.variable} ${menlo.variable} h-full antialiased`}>
      <body className="h-full">
        <CursorShell>{children}</CursorShell>
      </body>
    </html>
  );
}
