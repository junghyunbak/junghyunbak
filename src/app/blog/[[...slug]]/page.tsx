import { LabelList } from "@/components/LabelList";
import { IssueList } from "@/components/IssueList";
import { IssueListPaginate } from "@/components/IssueListPaginate";
import { apiService, issuesRequestDefaultOptions } from "@/apis";
import { Metadata } from "next";
import { REPO_NAME, REPO_OWNER } from "@/apis";
import Link from "next/link";

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
    ...issuesRequestDefaultOptions,
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
      labels: label.name,
      ...issuesRequestDefaultOptions,
    });

    slugs.push(
      ...Array(pageCount)
        .fill(null)
        .map((_, i) => ({ slug: [(i + 1).toString(), label.name] }))
    );
  }

  return slugs;
}

export function generateMetadata({
  params: { slug = [] },
}: {
  params: { slug?: string[] };
}): Metadata {
  const currentPage: number = Number(slug[0]) || 1;
  const currentLabel: string | undefined = slug[1]
    ? decodeURI(slug[1])
    : undefined;

  return {
    title: `Blog - ${
      currentLabel || "전체"
    } ${currentPage}페이지 | 개발자 박정현`,
  };
}

export default async function Blog({
  params: { slug = [] },
}: {
  params: { slug?: string[] };
}) {
  const currentPage: number = Number(slug[0]) || 1;
  const currentLabel: string | undefined = slug[1]
    ? decodeURI(slug[1])
    : undefined;

  const issuesRequestOptions: IssuesCoreRequestParameters = {
    page: currentPage,
    labels: currentLabel,
    ...issuesRequestDefaultOptions,
  };

  const [labels, issues, issuesPageCount] = await Promise.all([
    apiService.getAllLabel(),
    apiService.getIssues(issuesRequestOptions),
    apiService.getIssuesPageCount(issuesRequestOptions),
  ]);

  return (
    <div>
      <LabelList labels={labels} currentLabel={currentLabel} />
      <IssueList issues={issues} />
      <div className="relative my-6 flex justify-center">
        <IssueListPaginate
          pageCount={issuesPageCount}
          currentPage={currentPage}
          currentLabel={currentLabel}
        />

        <Link
          href={`https://github.com/${REPO_OWNER}/${REPO_NAME}/issues/new`}
          className="absolute right-0 flex h-6 items-center justify-center rounded-sm border border-black px-1 text-sm text-black"
        >
          글작성
        </Link>
      </div>
    </div>
  );
}
