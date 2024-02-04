import { Header } from "./_components/Header";
import "./globals.css";
import "@/assets/fonts/index.css";
import { Footer } from "./_components/Footer";

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
