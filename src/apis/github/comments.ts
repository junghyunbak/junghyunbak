import { GITHUB } from "@/constants";

// TODO: 해당 api로 인해 rate limit을 초과한 상태에서, 페이지가 재생성(isr)될 경우 403에러로 인해 올바르게 렌더링되지 못하는 이슈 해결책 찾기
export const getAnIssueComment = async (
  commentId: string
): Promise<AnIssueCommentResponseData | undefined> => {
  const url = `https://api.github.com/repos/${GITHUB.REPO_OWNER}/${GITHUB.REPO_NAME}/issues/comments/${commentId}`;

  const response = await fetch(url, {
    cache: "no-cache",
    headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
  });

  if (response.status >= 400) {
    return;
  }

  return (await response.json()) as AnIssueCommentResponseData;
};
