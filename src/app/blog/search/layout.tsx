import React, { Suspense } from "react";

export default function Layout({
  labels,
  issues,
  form,
  children,
}: {
  labels: React.ReactNode;
  form: React.ReactNode;
  issues: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <>
      {labels}

      <Suspense>
        {form}
        {issues}
      </Suspense>

      {children}
    </>
  );
}
