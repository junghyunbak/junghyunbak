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
  if (!currentPage || !pageCount) {
    return null;
  }

  return (
    <ul className="flex flex-wrap justify-center my-6 gap-x-1">
      {Array(pageCount)
        .fill(null)
        .map((_, i) => {
          const nextPage = i + 1;

          return (
            <li key={i}>
              <Link
                href={`/blog?page=${nextPage}${
                  currentLabel ? `&label=${currentLabel}` : ""
                }`}
                className="flex items-center justify-center w-6 border rounded-sm aspect-square border-primary"
              >
                <p className="text-sm text-primary">{nextPage}</p>
              </Link>
            </li>
          );
        })}
    </ul>
  );
}
