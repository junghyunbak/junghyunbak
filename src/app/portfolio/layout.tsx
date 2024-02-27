import React from "react";
import { Header } from "@/components/cores/Header";
import { ResponsivePaddingLayout } from "@/components/layouts/ResponsivePaddingLayout";

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
