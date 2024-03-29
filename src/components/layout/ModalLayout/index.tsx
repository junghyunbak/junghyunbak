import React from "react";

interface ModalLayoutProps {
  children: React.ReactNode;
}

export function ModalLayout({ children }: ModalLayoutProps) {
  return (
    <div className="flex h-[90dvh] w-[90dvw] flex-col bg-white lg:w-[60rem]">
      {children}
    </div>
  );
}
