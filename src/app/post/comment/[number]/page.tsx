import { apiService } from "@/apis";
import { CommentViewer } from "./_components/CommentViewer";

export default async function PostComment({
  params: { number },
}: {
  params: { number: string };
}) {
  const issueComment = await apiService.getAnIssueComment(number);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <CommentViewer issueComment={issueComment} />
    </div>
  );
}
