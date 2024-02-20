import React from "react";
import { Header } from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header currentPage="블로그" />

      <div className="max-md:p-3">{children}</div>
    </>
  );
}
