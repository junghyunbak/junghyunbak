"use client";

import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-11">
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<p>검색중...</p>}>{children}</Suspense>

        {process.env.NODE_ENV !== "production" && <ReactQueryDevtools />}
      </QueryClientProvider>
    </div>
  );
}
