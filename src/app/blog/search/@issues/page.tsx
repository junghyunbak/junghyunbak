"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchIssues() {
  const searchParams = useSearchParams();

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      await new Promise((resolve) => {
        setTimeout(resolve, 5000, true);
      });

      setIsReady(true);
    })();
  }, []);

  return (
    <div>
      {isReady ? (
        <p>pages: {JSON.stringify(searchParams, null, 2)}</p>
      ) : (
        <p>데이터 로드 중...</p>
      )}
    </div>
  );
}
