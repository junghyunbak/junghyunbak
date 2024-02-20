import React from "react";
import { Header } from "@/components/Header";

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

      <div className="max-md:p-3">
        {children}
        {modal}
      </div>
    </>
  );
}
