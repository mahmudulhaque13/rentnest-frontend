import type { Metadata } from "next";
import "./globals.css";

import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { AuthProvider } from "@/components/providers/auth-provider";

export const metadata: Metadata = {
  title: "RentNest",
  description: "Find your perfect rental home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
