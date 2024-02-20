"use client";

import React, { Suspense, useEffect, useState, useMemo } from "react";
import { QueryClient, QueryClientProvider, useQueryClient } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 0,
    },
  },
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-11">
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={LoadingFallback()}>{children}</Suspense>

          {process.env.NODE_ENV !== "production" && <ReactQueryDevtools />}
        </ErrorBoundary>
      </QueryClientProvider>
    </div>
  );
}

function ErrorFallback(props: FallbackProps) {
  const { error } = props;

  if (error.status === 403) {
    return ForbiddenErrorFallback(props);
  }

  return <p>예상치 못한 에러 발생</p>;
}

function LoadingFallback() {
  return <p>검색중...</p>;
}

function ForbiddenErrorFallback(props: FallbackProps) {
  const { error, resetErrorBoundary } = props;

  const [remainSecond, setRemainSecond] = useState(0);

  const queryClient = useQueryClient();

  const resetDate = useMemo(() => {
    if (!error.response || !error.response.headers["x-ratelimit-reset"]) {
      const utcDate = new Date(new Date().toISOString());

      return utcDate;
    }

    return new Date(
      parseInt(error.response.headers["x-ratelimit-reset"], 10) * 1000
    );
  }, [error]);

  useEffect(() => {
    const timer = setInterval(() => {
      const utcDate = new Date(new Date().toISOString());

      const second = Math.ceil(
        (resetDate.getTime() - utcDate.getTime()) / 1000
      );

      setRemainSecond(second);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [resetDate, setRemainSecond]);

  const minute = Math.floor(Math.max(remainSecond, 0) / 60);
  const second = Math.max(Math.max(remainSecond, 0)) % 60;

  return (
    <div>
      <p>요청이 너무 많습니다.{"\n"}</p>

      <p>
        <span>{`${minute.toString().padStart(2, "0")}분 ${second
          .toString()
          .padStart(2, "0")}초`}</span>{" "}
        후에 다시 시도하세요.
      </p>

      {remainSecond < 0 && (
        <p
          className="text-[#00f] cursor-pointer"
          onClick={() => {
            queryClient.removeQueries();
            resetErrorBoundary();
          }}
        >
          재시도하기
        </p>
      )}
    </div>
  );
}
