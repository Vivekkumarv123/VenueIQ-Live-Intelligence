import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VenueIQ | Stadium Intelligence Dashboard",
  description: "Real-time AI-powered stadium crowd optimization driven by Antigravity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-black text-white selection:bg-blue-500/30">
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
