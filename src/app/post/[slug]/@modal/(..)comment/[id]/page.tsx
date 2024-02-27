import { apiService } from "@/apis";
import { CommentContent } from "@/app/post/comment/[id]/_components/CommentContent";
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
          <CommentContent issueComment={issueComment} />
        </ScrollYWithPaddingLayout>
      </ModalLayout>
    </RouteModal>
  );
}
