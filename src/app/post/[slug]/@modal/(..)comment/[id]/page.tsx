import { apiService } from "@/apis";
import { ModalLayout } from "@/components/layout/ModalLayout";
import { RouteModal } from "@/components/core/RouteModal";
import { ScrollYWithPaddingLayout } from "@/components/layout/ScrollYWithPaddingLayout";
import { Markdown } from "@/components/core/Markdown";

export default async function CommentModal({
  params: { id },
}: {
  params: { id: string };
}) {
  const issueComment = await apiService.getAnIssueComment(id);

  if (!issueComment) {
    return <p>해당 이슈의 댓글을 찾을 수 없습니다.</p>;
  }

  return (
    <RouteModal>
      <ModalLayout>
        <ScrollYWithPaddingLayout>
          <Markdown markdown={issueComment.body} imageOptimize={false} />
        </ScrollYWithPaddingLayout>
      </ModalLayout>
    </RouteModal>
  );
}
