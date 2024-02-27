import { apiService } from "@/apis";
import { CommentViewer } from "./_components/CommentViewer";
import { Header } from "@/components/cores/Header";
import Link from "next/link";

export default async function PostComment({
  params: { number },
}: {
  params: { number: string };
}) {
  const issueComment = await apiService.getAnIssueComment(number);

  const issueNumber =
    (/https:\/\/github.com\/junghyunbak\/junghyunbak\/issues\/([0-9]+)/.exec(
      issueComment?.html_url || ""
    ) || [])[1];

  return (
    <>
      <Header currentPage="블로그" />
      <div className="mx-2 mb-8 mt-2">
        <Link
          className="underline-offset-4 hover:underline"
          href={`/post/${issueNumber}`}
        >
          ← 게시글 이동
        </Link>
      </div>
      <CommentViewer issueComment={issueComment} />
    </>
  );
}
