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
    <html
      className="h-full w-full scroll-smooth text-[16px] max-md:text-[14px]"
      lang="en"
    >
      <body className="m-auto h-full w-full max-w-[50rem]">
        <div className="min-h-full">{children}</div>

        <Footer />
      </body>
    </html>
  );
}
