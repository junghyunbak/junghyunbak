import { Header } from "@/components/Header";
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

      <div className="max-md:p-3">
        {children}
        {modal}
      </div>
    </>
  );
}
