import { CommentViewer } from "./_components/CommentViewer";

export default function PostComment({
  params: { number },
}: {
  params: { number: string };
}) {
  return (
    <div>
      <CommentViewer issueNumber={number} />
    </div>
  );
}
