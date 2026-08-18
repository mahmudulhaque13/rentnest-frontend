import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/shared/navbar";

export const metadata: Metadata = {
  title: "RentNest",
  description: "Find & List Rental Properties with Ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Navbar></Navbar>
        {children}
      </body>
    </html>
  );
}
