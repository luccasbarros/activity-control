import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Activity Control SDD",
  description: "Local activity control system built with Next.js, Prisma, and SQLite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
