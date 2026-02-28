import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Arctic Solutions | HVAC Services",
  description: "Professional HVAC services — installation, repair, and maintenance.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
