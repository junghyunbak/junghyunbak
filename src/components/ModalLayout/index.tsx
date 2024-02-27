import React from "react";

interface ModalLayoutProps {
  children: React.ReactNode;
}

export function ModalLayout({ children }: ModalLayoutProps) {
  return (
    <div className="flex h-[80dvh] w-[90dvw] flex-col bg-white lg:w-[60rem]">
      <div className="flex-1 overflow-y-scroll p-8">{children}</div>
    </div>
  );
}
