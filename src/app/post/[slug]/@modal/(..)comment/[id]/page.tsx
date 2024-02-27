import { apiService } from "@/apis";
import { CommentViewer } from "@/app/post/comment/[id]/_components/CommentViewer";
import { ModalLayout } from "@/components/layout/ModalLayout";
import { RouteModal } from "@/components/core/RouteModal";
import { ScrollYWithPaddingLayout } from "@/components/layout/ScrollYWithPaddingLayout";

export default async function CommentModal({
  params: { id },
}: {
  params: { id: string };
}) {
  const issueComment = await apiService.getAnIssueComment(id);

  return (
    <RouteModal>
      <ModalLayout>
        <ScrollYWithPaddingLayout>
          <CommentViewer issueComment={issueComment} />
        </ScrollYWithPaddingLayout>
      </ModalLayout>
    </RouteModal>
  );
}
