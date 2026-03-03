import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CleanStart - Startup Simulation",
  description: "A turn-based startup simulation game",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
