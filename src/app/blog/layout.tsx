import React from "react";
import { Header } from "@/components/Header";
import { ResponsivePaddingLayout } from "@/components/layouts/ResponsivePaddingLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header currentPage="블로그" />

      <ResponsivePaddingLayout>{children}</ResponsivePaddingLayout>
    </>
  );
}
