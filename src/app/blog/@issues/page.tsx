import { getIssues } from "@/apis";
import { REPO_OWNER, ISSUE_PER_PAGE } from "@/constants";
import { IssueList } from "./_components/IssueList";
import { IssueListPaginate } from "./_components/IssueListPaginate";

export default async function Issues({
  searchParams,
}: {
  searchParams: { page?: string; label?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;

  const { items: issues, pageCount } = await getIssues({
    page: currentPage,
    per_page: ISSUE_PER_PAGE,
    labels: searchParams.label,
    /**
     * 레포지토리 이슈에 다른 사람이 글을 쓸 경우의 대비
     */
    creator: REPO_OWNER,
    /**
     * about, portfolio에 쓰일 이슈를 assignee로 구분하기 위함
     */
    assignee: "none",
  });

  return (
    <div>
      <IssueList issues={issues} />
      <IssueListPaginate
        pageCount={pageCount}
        currentPage={currentPage}
        currentLabel={searchParams.label}
      />
    </div>
  );
}
