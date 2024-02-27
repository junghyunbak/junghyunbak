import React from "react";

interface ResponsivePaddingLayout {
  children: React.ReactNode;
}

export function ResponsivePaddingLayout({ children }: ResponsivePaddingLayout) {
  return <div className="max-md:p-3">{children}</div>;
}
