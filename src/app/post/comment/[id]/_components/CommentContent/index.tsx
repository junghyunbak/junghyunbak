import { Markdown } from "@/components/core/Markdown";

interface CommentContentProps {
  issueComment?: AnIssueCommentResponseData;
}

export function CommentContent({ issueComment }: CommentContentProps) {
  if (!issueComment) {
    return <p>해당 이슈 댓글을 찾을 수 없습니다.</p>;
  }

  return <Markdown markdown={issueComment.body} imageOptimize={false} />;
}
