import { apiService } from "@/apis";
import { Header } from "@/components/core/Header";
import Link from "next/link";
import { ResponsivePaddingLayout } from "@/components/layout/ResponsivePaddingLayout";
import { Markdown } from "@/components/core/Markdown";
import { imageUtils } from "@/utils";
import { type Metadata } from "next";

export async function generateStaticParams() {
  const allIssueComment = await apiService.getAllIssueComment();

  return allIssueComment.map((issueComment) => ({
    id: issueComment.id.toString(),
  }));
}

export async function generateMetadata({
  params: { id },
}: {
  params: { id: string };
}): Promise<Metadata> {
  const issueComment = await apiService.getAnIssueComment(id);

  const issueNumber =
    (/https:\/\/github.com\/junghyunbak\/junghyunbak\/issues\/([0-9]+)/.exec(
      issueComment?.html_url || ""
    ) || [])[1];

  return {
    title: `${issueNumber}번 게시글 댓글 - ${id} | 개발자 박정현`,
    description: (issueComment?.body || "").slice(0, 80),
  };
}

export default async function PostComment({
  params: { id },
}: {
  params: { id: string };
}) {
  const issueComment = await apiService.getAnIssueComment(id);

  if (!issueComment) {
    return <p>해당 이슈의 댓글을 찾을 수 없습니다.</p>;
  }

  const issueNumber =
    (/https:\/\/github.com\/junghyunbak\/junghyunbak\/issues\/([0-9]+)/.exec(
      issueComment?.html_url || ""
    ) || [])[1];

  const imageUrls = imageUtils.extractImageUrlsFromMarkdown(issueComment.body);
  const imageUrlToPreviewImage = await imageUtils.getImageUrlToPreviewImageData(
    imageUrls
  );

  return (
    <>
      <Header currentPage="블로그" />

      <ResponsivePaddingLayout>
        <div className="mx-2 mb-8 mt-2">
          <Link
            className="underline-offset-4 hover:underline"
            href={`/post/${issueNumber}`}
          >
            ← 게시글 이동
          </Link>
        </div>

        <Markdown
          markdown={issueComment.body}
          imageUrlToPreviewImage={imageUrlToPreviewImage}
        />
      </ResponsivePaddingLayout>
    </>
  );
}
