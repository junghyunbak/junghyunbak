import { MarkdownContent } from "@/components/MarkdownContent";
import { apiService, REPO_OWNER, REPO_NAME } from "@/apis";
import Link from "next/link";
import { Metadata } from "next";
import { Hits } from "@/components/Hits";
import { Utterances } from "@/components/Utterances";
import { Toc } from "@/components/Toc";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkExtractFrontmatter from "remark-extract-frontmatter";
import remarkFrontmatter from "remark-frontmatter";
import remarkStringify from "remark-stringify";
const toml = require("toml").parse;

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

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const issue = await apiService.getAnIssue(params.slug);

  const file = await unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ["toml"])
    .use(remarkExtractFrontmatter, { toml })
    .use(remarkStringify)
    .process(issue?.body || "");

  const {
    data: { description },
  } = file;

  console.log(file);

  return {
    title: `Post - ${params.slug} | 박정현`,
    description:
      typeof description === "string"
        ? description
        : (issue?.body || "").slice(0, 80),
  };
}

export default async function Post({ params }: { params: { slug: string } }) {
  const issue = await apiService.getAnIssue(params.slug);

  if (!issue) {
    return <div>존재하지 않는 페이지입니다.</div>;
  }

  if (issue.user?.login !== REPO_OWNER) {
    return <div>해당 글은 조회할 수 없습니다.</div>;
  }

  return (
    <div>
      <div className="mt-16 border-b border-gray-800 border-dashed mb-7">
        <div className="flex flex-col items-center gap-3.5 pb-3.5">
          <p className="text-2xl font-semibold text-center">{issue.title}</p>

          <div className="flex items-center gap-3.5">
            <p className="text-sm text-gray-600">
              {new Date(issue.created_at).toLocaleString("ko-KR")}
            </p>

            <div className="h-3.5 border-l border-gray-600" />

            <Link
              className="text-sm text-gray-600"
              href={`https://github.com/${REPO_OWNER}/${REPO_NAME}/issues/${issue.number}`}
            >
              수정하기
            </Link>
          </div>

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

        <Hits path={`/post/${issue.number}`} />
      </div>

      <Toc markdown={issue.body || ""} />

      <MarkdownContent content={issue.body || ""} />

      <Utterances issueNumber={issue.number} />
    </div>
  );
}
