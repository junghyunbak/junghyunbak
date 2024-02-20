import React from "react";
import { Header } from "@/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header currentPage="블로그" />

      {children}
    </>
  );
}
