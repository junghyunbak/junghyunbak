import { apiService } from "@/apis";
import { CommentViewer } from "@/app/post/comment/[number]/_components/CommentViewer";
import { ModalLayout } from "@/components/ModalLayout";
import { RouteModal } from "@/components/RouteModal";

export default async function CommentModal({
  params: { number },
}: {
  params: { number: string };
}) {
  const issueComment = await apiService.getAnIssueComment(number);

  return (
    <RouteModal>
      <ModalLayout>
        <CommentViewer issueComment={issueComment} />
      </ModalLayout>
    </RouteModal>
  );
}
