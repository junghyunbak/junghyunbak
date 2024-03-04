import { apiService } from "@/apis";
import { GITHUB } from "@/constants";
import Link from "next/link";
import { Metadata } from "next";
import { Hits } from "@/components/core/Hits";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkExtractFrontmatter from "remark-extract-frontmatter";
import remarkFrontmatter from "remark-frontmatter";
import remarkStringify from "remark-stringify";
import { imageUtils } from "@/utils";
import { Issue } from "@/components/widget/Issue";
const toml = require("toml").parse;

export async function generateStaticParams() {
  const issues = await apiService.getAllIssue({
    /**
     * 레포지토리 이슈에 다른 사람이 글을 쓸 경우의 대비
     */
    creator: GITHUB.REPO_OWNER,
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

  return {
    title: `Post - "${issue?.title}" | 개발자 박정현`,
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

  if (!issue.body) {
    return <div>올바르지 않은 페이지입니다.</div>;
  }

  if (issue.user?.login !== GITHUB.REPO_OWNER) {
    return <div>해당 글은 조회할 수 없습니다.</div>;
  }

  const imageUrls = imageUtils.extractImageUrlsFromMarkdown(issue.body);
  const imageUrlToPreviewImage = await imageUtils.getImageUrlToPreviewImageData(
    imageUrls
  );

  return (
    <>
      <div className="mb-7 mt-16 border-b border-dashed border-gray-800">
        <div className="flex flex-col items-center gap-3.5 pb-3.5">
          <p className="text-center text-2xl font-semibold">{issue.title}</p>

          <div className="flex items-center gap-3.5">
            <p className="text-sm text-gray-600">
              {new Date(issue.created_at).toLocaleString("ko-KR")}
            </p>

            <div className="h-3.5 border-l border-gray-600" />

            <a
              className="text-sm text-gray-600"
              href={`https://github.com/${GITHUB.REPO_OWNER}/${GITHUB.REPO_NAME}/issues/${issue.number}`}
              target="_blank"
            >
              수정하기
            </a>
          </div>

          <ul className="flex flex-wrap gap-2.5">
            {issue.labels.map((label, i) => {
              const id = typeof label === "string" ? i : label.id || i;
              const name = typeof label === "string" ? label : label.name || "";

              return (
                <li key={id}>
                  <Link
                    href={`/blog/1/${name}`}
                    className="text-g700 font-semibold"
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

      <Issue
        markdown={issue.body}
        number={issue.number}
        imageUrlToPreviewImage={imageUrlToPreviewImage}
      />
    </>
  );
}
