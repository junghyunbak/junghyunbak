import { apiService } from "@/apis";
import { CommentViewer } from "@/app/post/comment/[number]/_components/CommentViewer";
import { ModalLayout } from "@/components/layouts/ModalLayout";
import { RouteModal } from "@/components/cores/RouteModal";
import { ScrollYWithPaddingLayout } from "@/components/layouts/ScrollYWithPaddingLayout";

export default async function CommentModal({
  params: { number },
}: {
  params: { number: string };
}) {
  const issueComment = await apiService.getAnIssueComment(number);

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
