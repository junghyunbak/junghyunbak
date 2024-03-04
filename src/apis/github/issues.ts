import { GITHUB } from "@/constants";
import { apiUtils } from "@/utils";

export const getIssues = async (
  options?: IssuesCoreRequestParameters
): Promise<IssuesCoreResponseData> => {
  const _options = apiUtils.objectValueFilterAndToString(options);

  const url = `https://api.github.com/repos/${GITHUB.REPO_OWNER}/${GITHUB.REPO_NAME}/issues`;
  const queryString = new URLSearchParams({ ..._options });

  const response = await fetch(`${url}?${queryString}`, {
    cache: "force-cache",
    headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
    next: {
      tags: ["issues"],
    },
  });

  const data = await response.json();

  return data as IssuesCoreResponseData;
};

export const getIssuesPageCount = async (
  options?: IssuesCoreRequestParameters
): Promise<number> => {
  const _options = apiUtils.objectValueFilterAndToString(options);

  const url = `https://api.github.com/repos/${GITHUB.REPO_OWNER}/${GITHUB.REPO_NAME}/issues`;
  const queryString = new URLSearchParams({ ..._options });

  const response = await fetch(`${url}?${queryString}`, {
    cache: "force-cache",
    headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
    next: {
      tags: ["issuesPageCount"],
    },
  });

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

  const _options = apiUtils.objectValueFilterAndToString(options);

  const url = `https://api.github.com/repos/${GITHUB.REPO_OWNER}/${GITHUB.REPO_NAME}/issues`;

  for (let i = 0; i < pageCount; i++) {
    const page = i + 1;

    const queryString = new URLSearchParams({
      ..._options,
      page: page.toString(),
    });

    const response = await fetch(`${url}?${queryString}`, {
      cache: "force-cache",
      headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
      next: {
        tags: ["allIssue"],
      },
    });

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

  const data = await response.json();

  return data as AnIssueResponseData;
};
