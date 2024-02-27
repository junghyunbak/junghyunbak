import React from "react";
import { Header } from "@/components/core/Header";
import { ResponsivePaddingLayout } from "@/components/layout/ResponsivePaddingLayout";

export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <Header currentPage="포트폴리오" />

      <ResponsivePaddingLayout>
        {children}
        {modal}
      </ResponsivePaddingLayout>
    </>
  );
}
