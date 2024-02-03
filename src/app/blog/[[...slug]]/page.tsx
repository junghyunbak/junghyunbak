import { LabelList } from "../_components/LabelList";
import { IssueList } from "../_components/IssueList";
import { IssueListPaginate } from "../_components/IssueListPaginate";
import { REPO_OWNER, ISSUE_PER_PAGE } from "@/constants";
import { apiService } from "@/apis";

/**
 * 라벨만 존재하는 경우를 빼놓음
 */
/*
export async function generateStaticParams() {
  const slugs: { slug: (string | undefined)[] }[] = [{ slug: [] }];

  const labels = await getAllLabels();

  for (const label of [null, ...labels]) {
    const { pageCount } = await getIssues({
      per_page: ISSUE_PER_PAGE,
      labels: label?.name,
    });

    slugs.push(
      ...Array(pageCount)
        .fill(null)
        .map((_, i) => ({ slug: [label?.name || "all", `${i + 1}`] }))
    );
  }

  return slugs;
}
*/

export default async function Blog({
  params: { slug = [] },
}: {
  params: { slug?: string[] };
}) {
  const currentPage: number = Number(slug[0]) || 1;
  /**
   * null vs undefined
   */
  const currentLabel: string | undefined = slug[1]
    ? decodeURI(slug[1])
    : undefined;

  const [labels, { pageCount, items: issues }] = await Promise.all([
    apiService.getAllLabel(),
    apiService.getIssues({
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
