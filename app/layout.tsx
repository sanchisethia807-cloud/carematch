import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CareMatch — find the right specialist",
  description:
    "Describe your symptoms in your own words and find out which kind of specialist to see. Not a diagnosis.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CareMatch",
  },
};

export const viewport = {
  themeColor: "#5b7786",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}