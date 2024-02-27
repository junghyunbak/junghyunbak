import React from "react";
import { Header } from "@/components/core/Header";
import { ResponsivePaddingLayout } from "@/components/layout/ResponsivePaddingLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header currentPage="블로그" />

      <ResponsivePaddingLayout>{children}</ResponsivePaddingLayout>
    </>
  );
}
