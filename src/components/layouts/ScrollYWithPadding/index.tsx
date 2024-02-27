import React from "react";

interface ScrollYWithPaddingProps {
  children: React.ReactNode;
}

export function ScrollYWithPadding({ children }: ScrollYWithPaddingProps) {
  return <div className="flex-1 overflow-y-scroll p-8">{children}</div>;
}
