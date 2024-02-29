import { apiService } from "@/apis";
import { CommentContent } from "./_components/CommentContent";
import { Header } from "@/components/core/Header";
import Link from "next/link";
import { ResponsivePaddingLayout } from "@/components/layout/ResponsivePaddingLayout";

/**
 * TODO: 모든 issue의 comment를 가져와 정적 페이지로 생성하기.
 * 
 * 단, 작성자가 블로그 운영자 본인인 것에 대해서만
 */

export default async function PostComment({
  params: { id },
}: {
  params: { id: string };
}) {
  const issueComment = await apiService.getAnIssueComment(id);

  const issueNumber =
    (/https:\/\/github.com\/junghyunbak\/junghyunbak\/issues\/([0-9]+)/.exec(
      issueComment?.html_url || ""
    ) || [])[1];

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
        <CommentContent issueComment={issueComment} />
      </ResponsivePaddingLayout>
    </>
  );
}
