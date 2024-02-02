import React from "react";

export default function Layout({
  children,
  labels,
  issues,
}: {
  children: React.ReactNode;
  labels: React.ReactNode;
  issues: React.ReactNode;
}) {
  return (
    <>
      {labels}
      {issues}
      {children}
    </>
  );
}
