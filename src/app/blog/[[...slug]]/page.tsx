import { LabelList } from "../_components/LabelList";
import { IssueList } from "../_components/IssueList";
import { IssueListPaginate } from "../_components/IssueListPaginate";
import { REPO_OWNER, ISSUE_PER_PAGE } from "@/constants";
import { apiService } from "@/apis";

/**
 * /blog                - 태그 없이 조회, 1페이지
 * /blog/{page}         - 태그 없이 조회, {page}페이지
 * /blog/{page}/{label} - {label}태그로 조회, {page}페이지
 */
export async function generateStaticParams() {
  const slugs: { slug: string[] }[] = [{ slug: [] }];

  /**
   * 라벨 없이 조회
   */
  const pageCount = await apiService.getIssuesPageCount({
    per_page: ISSUE_PER_PAGE,
  });

  slugs.push(
    ...Array(pageCount)
      .fill(null)
      .map((_, i) => ({ slug: [(i + 1).toString()] }))
  );

  /**
   * 라벨로 조회
   */
  const labels = await apiService.getAllLabel();

  for (const label of labels) {
    const pageCount = await apiService.getIssuesPageCount({
      per_page: ISSUE_PER_PAGE,
      labels: label.name,
    });

    slugs.push(
      ...Array(pageCount)
        .fill(null)
        .map((_, i) => ({ slug: [(i + 1).toString(), label.name] }))
    );
  }

  return slugs;
}

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

  const [labels, issues, issuesPageCount] = await Promise.all([
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
    apiService.getIssuesPageCount({
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
        pageCount={issuesPageCount}
        currentPage={currentPage}
        currentLabel={currentLabel}
      />
    </div>
  );
}