import { GITHUB } from "@/constants";
import { apiUtils } from "@/utils";

export const getIssues = async (
  options?: IssuesCoreRequestParameters
): Promise<IssuesCoreResponseData> => {
  const url = `https://api.github.com/repos/${GITHUB.REPO_OWNER}/${GITHUB.REPO_NAME}/issues`;

  const queryString = apiUtils.objectToQueryString(options);

  const response = await fetch(url + queryString, {
    cache: "force-cache",
    headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
    next: {
      tags: ["issues"],
    },
  });

  if (response.status >= 400) {
    return [];
  }

  return (await response.json()) as IssuesCoreResponseData;
};

export const getIssuesPageCount = async (
  options?: IssuesCoreRequestParameters
): Promise<number> => {
  const url = `https://api.github.com/repos/${GITHUB.REPO_OWNER}/${GITHUB.REPO_NAME}/issues`;

  const queryString = apiUtils.objectToQueryString(options);

  const response = await fetch(url + queryString, {
    cache: "force-cache",
    headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
    next: {
      tags: ["issuesPageCount"],
    },
  });

  if (response.status >= 400) {
    return 0;
  }

  const pageCount = apiUtils.getPageCount(
    apiUtils.parseLink(response.headers.get("link"))
  );

  return pageCount;
};

export const getAllIssue = async (
  options?: IssuesCoreRequestParameters
): Promise<IssuesCoreResponseData> => {
  const issues: IssuesCoreResponseData = [];

  const pageCount = await getIssuesPageCount(options);

  const url = `https://api.github.com/repos/${GITHUB.REPO_OWNER}/${GITHUB.REPO_NAME}/issues`;

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
        tags: ["allIssue"],
      },
    });

    if (response.status >= 400) {
      continue;
    }

    issues.push(
      ...Array.from((await response.json()) as IssuesCoreResponseData)
    );
  }

  return issues;
};

export const getAnIssue = async (
  issueNumber: string
): Promise<AnIssueResponseData | null> => {
  const url = `https://api.github.com/repos/${GITHUB.REPO_OWNER}/${GITHUB.REPO_NAME}/issues/${issueNumber}`;

  const response = await fetch(url, {
    cache: "force-cache",
    headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
    next: {
      tags: ["issue", issueNumber],
    },
  });

  if (response.status >= 400) {
    return null;
  }

  return (await response.json()) as AnIssueResponseData;
};
