"use client";

import { useRouter } from "next/navigation";
import CircleX from "@/assets/svgs/circle-x.svg";
import React, { useEffect } from "react";

interface ModalProps {
  children: React.ReactNode;
}

export function RouteModal({ children }: ModalProps) {
  const router = useRouter();

  const handleModalClose = () => {
    router.back();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.back();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-[#0000008f] backdrop-blur-sm"
        onClick={handleModalClose}
      />

      <div className="relative z-10 max-w-[90%] max-h-[90%]">
        {children}

        <div
          className="absolute w-[24px] top-[-12px] right-[-12px]  aspect-square cursor-pointer"
          onClick={handleModalClose}
        >
          <CircleX className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
