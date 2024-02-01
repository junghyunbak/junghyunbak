import { getIssues, getLabels } from "@/apis";
import { IssueList } from "./_components/IssueList";
import { LabelList } from "./_components/LabelList";
import { REPO_OWNER } from "@/constants";
import { IssueListPaginate } from "./_components/IssueListPaginate";

const ISSUE_PER_PAGE = 2;

export default async function Blog({
  searchParams,
}: {
  searchParams: { page?: string; label?: string };
}) {
  const { items: issues, pageCount } = await getIssues({
    per_page: ISSUE_PER_PAGE,
    creator: REPO_OWNER,
  });
  const labels = await getLabels();

  return (
    <div>
      <LabelList labels={labels} currentLabel={searchParams.label} />
      <IssueList issues={issues} />
      <IssueListPaginate
        pageCount={pageCount}
        currentPage={searchParams.page}
        currentLabel={searchParams.label}
      />
    </div>
  );
}
