import Link from "next/link";

interface PaginateProps {
  pageCount: number;
  currentPage: number;
  currentLabel?: string;
}

/**
 * `react-paginate` 패키지 사용에 이슈가 있어
 *
 * 매우 간단한 형태로 paginate를 구현
 */
export function IssueListPaginate({
  pageCount,
  currentPage,
  currentLabel,
}: PaginateProps) {
  return (
    <ul className="flex flex-wrap justify-center gap-x-1">
      {Array(pageCount)
        .fill(null)
        .map((_, i) => {
          const page = i + 1;

          const isActive = currentPage === page;

          const nextHref = currentLabel
            ? `/blog/${page}/${currentLabel}`
            : `/blog/${page}`;

          return (
            <li key={i}>
              <Link
                href={nextHref}
                className={[
                  "flex aspect-square w-6 items-center justify-center rounded-sm border border-primary text-sm",
                  isActive ? "bg-primary text-white" : "text-primary",
                ].join(" ")}
              >
                {page}
              </Link>
            </li>
          );
        })}
    </ul>
  );
}
