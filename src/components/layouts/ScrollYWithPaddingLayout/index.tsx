import React from "react";

interface ScrollYWithPaddingLayoutProps {
  children: React.ReactNode;
}

export function ScrollYWithPaddingLayout({
  children,
}: ScrollYWithPaddingLayoutProps) {
  return <div className="flex-1 overflow-y-scroll p-8">{children}</div>;
}
