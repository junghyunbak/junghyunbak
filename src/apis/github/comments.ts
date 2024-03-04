import { GITHUB } from "@/constants";
import { apiUtils } from "@/utils";

export const getIssueCommentsPageCount = async (
  options?: IssueCommentsRequestParameters
): Promise<number> => {
  const url = `https://api.github.com/repos/${GITHUB.REPO_OWNER}/${GITHUB.REPO_NAME}/issues/comments`;

  const queryString = apiUtils.objectToQueryString(options);

  const response = await fetch(url + queryString, {
    cache: "force-cache",
    headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
    next: {
      tags: ["issueCommentsPageCount"],
    },
  });

  if (response.status >= 400) {
    return 0;
  }

  return apiUtils.getPageCount(
    apiUtils.parseLink(response.headers.get("link"))
  );
};

export const getAllIssueComment = async (
  options?: IssueCommentsRequestParameters
): Promise<IssueCommentsResponseData> => {
  const comments: IssueCommentsResponseData = [];

  const url = `https://api.github.com/repos/${GITHUB.REPO_OWNER}/${GITHUB.REPO_NAME}/issues/comments`;

  const pageCount = await getIssueCommentsPageCount(options);

  for (let i = 0; i < pageCount; i++) {
    const page = i + 1;

    const queryString = apiUtils.objectToQueryString({
      ...options,
      page,
    });

    const response = await fetch(url + queryString, {
      cache: "force-cache",
      headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
      next: {
        tags: ["allIssueComment"],
      },
    });

    if (response.status >= 400) {
      continue;
    }

    comments.push(...(await response.json()));
  }

  return comments;
};

export const getAnIssueComment = async (
  commentId: string
): Promise<AnIssueCommentResponseData | undefined> => {
  const url = `https://api.github.com/repos/${GITHUB.REPO_OWNER}/${GITHUB.REPO_NAME}/issues/comments/${commentId}`;

  const response = await fetch(url, {
    cache: "force-cache",
    headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
    next: {
      tags: ["comments", commentId],
    },
  });

  if (response.status >= 400) {
    return;
  }

  return (await response.json()) as AnIssueCommentResponseData;
};
