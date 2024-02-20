import { Header } from "./_components/Header";
import "./globals.css";
import "@/assets/fonts/index.css";
import { Footer } from "./_components/Footer";
import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  verification: {
    google: "cT0MruhYhAIxE2PwRZWlZmOseoYdbQeBXWNULoe0kEI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="text-[16px] max-md:text-[14px] w-full h-full" lang="en">
      <body className="w-full max-w-[50rem] h-full m-auto">
        <div className="min-h-full">
          <Header />

          <div className="max-md:p-3">{children}</div>
        </div>

        <Footer />
      </body>
    </html>
  );
}
