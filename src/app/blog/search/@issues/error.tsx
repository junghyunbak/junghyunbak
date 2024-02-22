"use client";

import { useState, useMemo, useEffect } from "react";
import { useQueryClient } from "react-query";

export default function Error({
  error,
  reset,
}: {
  /**
   * https://nextjs.org/docs/app/building-your-application/routing/error-handling#recovering-from-errors
   *
   * 공식 문서 예제에 사용된 타입 `Error`는 api 호출에서 발생한 에러 타입과 일치하지 않아 일단 any로 작성
   */
  error: any;
  reset: () => void;
}) {
  if (error.status === 403) {
    return <Forbidden error={error} reset={reset} />;
  }

  return <p>오류 발생</p>;
}

function Forbidden({ error, reset }: { error: any; reset: () => void }) {
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
          className="cursor-pointer text-clickable"
          onClick={() => {
            queryClient.removeQueries();
            reset();
          }}
        >
          재시도하기
        </p>
      )}
    </div>
  );
}
