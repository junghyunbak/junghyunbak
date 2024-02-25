import { Markdown } from "@/components/Markdown";

interface CommentViewerProps {
  issueComment?: AnIssueCommentResponseData;
}

export function CommentViewer({ issueComment }: CommentViewerProps) {
  if (!issueComment) {
    return (
      <div className="flex h-[80dvh] w-[90dvw] flex-col bg-white lg:w-[60rem]">
        <p>해당 이슈 댓글을 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex h-[80dvh] w-[90dvw] flex-col bg-white lg:w-[60rem]">
      <div className="overflow-y-scroll p-8">
        <Markdown markdown={issueComment.body} imageOptimize={false} />
      </div>
    </div>
  );
}
