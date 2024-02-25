import { apiService } from "@/apis";
import { CommentViewer } from "@/app/post/comment/[number]/_components/CommentViewer";
import { RouteModal } from "@/components/RouteModal";

export default async function CommentModal({
  params: { number },
}: {
  params: { number: string };
}) {
  const issueComment = await apiService.getAnIssueComment(number);

  return (
    <RouteModal>
      <CommentViewer issueComment={issueComment} />
    </RouteModal>
  );
}
