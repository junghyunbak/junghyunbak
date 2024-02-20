"use client";

import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="my-11">
        <Suspense key={searchParams.toString()} fallback={<p>로딩 중...</p>}>
          {children}
        </Suspense>
      </div>

      {process.env.NODE_ENV !== "production" && <ReactQueryDevtools />}
    </QueryClientProvider>
  );
}
