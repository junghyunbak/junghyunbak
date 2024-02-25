import { CommentViewer } from "@/app/post/comment/[number]/_components/CommentViewer";
import { RouteModal } from "@/components/RouteModal";

export default function CommentModal({
  params: { number },
}: {
  params: { number: string };
}) {
  return (
    <RouteModal>
      <CommentViewer issueNumber={number} />
    </RouteModal>
  );
}
