import { MarkdownContent } from "@/components/MarkdownContent";
import { apiService, REPO_OWNER } from "@/apis";
import Link from "next/link";
import { Metadata } from "next";

export async function generateStaticParams() {
  const issues = await apiService.getAllIssue({
    /**
     * 레포지토리 이슈에 다른 사람이 글을 쓸 경우의 대비
     */
    creator: REPO_OWNER,
    /**
     * about, portfolio에 쓰일 이슈를 assignee로 구분하기 위함
     */
    assignee: "none",
  });

  return issues.map((issue) => ({ slug: issue.number.toString() }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  return {
    title: `Post - ${params.slug} | 박정현`,
  };
}

export default async function Post({ params }: { params: { slug: string } }) {
  const issue = await apiService.getAnIssue(params.slug);

  if (!issue) {
    return <div>존재하지 않는 페이지입니다.</div>;
  }

  return (
    <div>
      <div className="flex flex-col items-center mt-16 mb-7 [&>*]:pb-3.5 border-b border-dashed border-gray-800">
        <p className="text-2xl font-semibold text-center">{issue.title}</p>

        <p className="text-g600">
          {new Date(issue.created_at).toLocaleString("ko-KR")}
        </p>

        <ul className="flex flex-wrap gap-2.5">
          {issue.labels.map((label, i) => {
            const id = typeof label === "string" ? i : label.id || i;
            const name = typeof label === "string" ? label : label.name || "";

            return (
              <li key={id}>
                <Link
                  href={`/blog/1/${name}`}
                  className="font-semibold text-g700"
                >
                  {`#${name}`}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <MarkdownContent content={issue.body || ""} />
    </div>
  );
}
