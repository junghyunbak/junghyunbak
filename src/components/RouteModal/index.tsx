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
        className="absolute inset-0 bg-[#0003] backdrop-blur-sm"
        onClick={handleModalClose}
      />

      <div className="relative z-10">
        {children}

        <div
          className="absolute right-[-0.75rem] top-[-0.75rem] aspect-square w-[1.5rem] cursor-pointer"
          onClick={handleModalClose}
        >
          <CircleX className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
