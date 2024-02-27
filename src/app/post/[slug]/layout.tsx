import { Header } from "@/components/Header";
import { ResponsivePaddingLayout } from "@/components/layouts/ResponsivePaddingLayout";
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
