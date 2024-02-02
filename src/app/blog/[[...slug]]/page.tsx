import { LabelList } from "../_components/LabelList";
import { IssueList } from "../_components/IssueList";
import { IssueListPaginate } from "../_components/IssueListPaginate";
import { REPO_OWNER, ISSUE_PER_PAGE } from "@/constants";

/*
export async function generateStaticParams(){
  
}
*/

import { getAllLabels, getIssues } from "@/apis";

export default async function Blog({
  params: { slug = [] },
}: {
  params: { slug?: string[] };
}) {
  /**
   * `all` 이라는 이름의 태그가 있을 경우 문제가 있음
   */
  const currentLabel =
    !slug[0] || slug[0] === "all" ? undefined : decodeURI(slug[0]);
  const currentPage = Number(slug[1]) || 1;

  const [labels, { pageCount, items: issues }] = await Promise.all([
    getAllLabels(),
    getIssues({
      page: currentPage,
      per_page: ISSUE_PER_PAGE,
      labels: currentLabel,
      /**
       * 레포지토리 이슈에 다른 사람이 글을 쓸 경우의 대비
       */
      creator: REPO_OWNER,
      /**
       * about, portfolio에 쓰일 이슈를 assignee로 구분하기 위함
       */
      assignee: "none",
    }),
  ]);

  return (
    <div>
      <LabelList labels={labels} currentLabel={currentLabel} />
      <IssueList issues={issues} />
      <IssueListPaginate
        pageCount={pageCount}
        currentPage={currentPage}
        currentLabel={currentLabel}
      />
    </div>
  );
}
