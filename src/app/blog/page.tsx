import { getIssues, getLabels } from "@/apis";
import { IssueList } from "./_components/IssueList";
import { LabelList } from "./_components/LabelList";
import { REPO_OWNER, ISSUE_PER_PAGE } from "@/constants";
import { IssueListPaginate } from "./_components/IssueListPaginate";

export default async function Blog({
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
  const labels = await getLabels();

  return (
    <div>
      <LabelList labels={labels} currentLabel={searchParams.label} />
      <IssueList issues={issues} />
      <IssueListPaginate
        pageCount={pageCount}
        currentPage={currentPage}
        currentLabel={searchParams.label}
      />
    </div>
  );
}
