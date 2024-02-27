import { Header } from "@/components/core/Header";
import { ResponsivePaddingLayout } from "@/components/layout/ResponsivePaddingLayout";
import React from "react";

export default function Layout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <Header currentPage="블로그" />

      <ResponsivePaddingLayout>
        {children}
        {modal}
      </ResponsivePaddingLayout>
    </>
  );
}
