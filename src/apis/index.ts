import parseLink from "parse-link-header";

export const REPO_OWNER = "junghyunbak";
export const REPO_NAME = "junghyunbak";

export const ISSUE_PER_PAGE = 10;

export const ISSUE_ABOUT_NUMBER = 18;
export const ISSUE_PORTFOLIO_NUMBER = 19;

export const issuesRequestDefaultOptions: IssuesCoreRequestParameters = {
  per_page: ISSUE_PER_PAGE,
  /**
   * 레포지토리 이슈에 다른 사람이 글을 쓸 경우의 대비
   */
  creator: REPO_OWNER,
  /**
   * about, portfolio에 쓰일 이슈를 assignee로 구분하기 위함
   */
  assignee: "none",
};

declare namespace parseLinkHeader {
  interface Link {
    page: string;
    per_page: string;
  }

  interface Links {
    first?: Link;
    prev?: Link;
    next?: Link;
    last?: Link;
  }
}

const isLastPage = (pageLinks: parseLinkHeader.Links): boolean => {
  return Object.keys(pageLinks).length === 2 &&
    pageLinks.first &&
    pageLinks.prev
    ? true
    : false;
};

const getPageCount = (pageLinks: parseLinkHeader.Links | null): number => {
  /**
   * `pageLinks`가 null인 경우는 다음과 같다.
   *
   * 1. 조건에 맞는 데이터가 존재하지 않을 때
   * 2. 조건에 맞는 데이터의 수가 `per_page`보다 작을 때
   *
   * 항상 페이지 수 0을 반환하게 되면, 2의 경우에서 데이터가 존재하지만 가져오지 못하게 되므로, 페이지 수 1을 반환한다.
   */
  if (!pageLinks) {
    return 1;
  }

  /**
   * 마지막 페이지일 경우 first와 prev 두 가지 링크가 존재한다.
   *
   * 총 페이지 수는 prev에 1을 더한 값이 된다.
   */
  if (isLastPage(pageLinks) && pageLinks.prev) {
    return parseInt(pageLinks.prev.page, 10) + 1;
  }

  /**
   * pageLinks에 last 링크가 존재한다면,
   *
   * 마지막 페이지가 아닌 처음 혹은 중간 페이지가 될 것이고,
   *
   * 총 페이지 수는 last 링크의 값이 된다.
   */
  if (pageLinks.last) {
    return parseInt(pageLinks.last.page, 10);
  }

  /**
   * 페이지가 처음 혹은 마지막에 모두 해당되지 않는 경우는
   *
   * 아무런 데이터가 없다고 해석할 수 있으므로 0을 반환한다.
   */
  return 0;
};

const objectValueFilterAndToString = (
  obj: Record<string, unknown> = {}
): Record<string, string> => {
  const newObj: Record<string, string> = {};

  Object.entries(obj).map(([key, value]) => {
    if (!value) {
      return;
    }

    newObj[key] = value.toString();
  });

  return newObj;
};

const getIssues = async (
  options?: IssuesCoreRequestParameters
): Promise<IssuesCoreResponseData> => {
  const _options = objectValueFilterAndToString(options);

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`;
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

const getIssuesPageCount = async (
  options?: IssuesCoreRequestParameters
): Promise<number> => {
  const _options = objectValueFilterAndToString(options);

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`;
  const queryString = new URLSearchParams({ ..._options });

  const response = await fetch(`${url}?${queryString}`, {
    cache: "force-cache",
    headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
    next: {
      tags: ["issuesPageCount"],
    },
  });

  const pageCount = getPageCount(parseLink(response.headers.get("link")));

  return pageCount;
};

const getAllIssue = async (
  options?: IssuesCoreRequestParameters
): Promise<IssuesCoreResponseData> => {
  const issues: IssuesCoreResponseData = [];

  const pageCount = await getIssuesPageCount(options);

  const _options = objectValueFilterAndToString(options);

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`;

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

const getAnIssue = async (
  issueNumber: string
): Promise<AnIssueResponseData | null> => {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issueNumber}`;

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

const getLabelsPageCount = async (
  options?: LabelsRequestParameters
): Promise<number> => {
  const _options = objectValueFilterAndToString(options);

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/labels`;
  const queryString = new URLSearchParams({
    ..._options,
  });

  const response = await fetch(`${url}?${queryString}`, {
    cache: "force-cache",
    headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
    next: {
      tags: ["labelsPageCount"],
    },
  });

  const pageCount = getPageCount(parseLink(response.headers.get("link")));

  return pageCount;
};

const getAllLabel = async (
  options?: LabelsRequestParameters
): Promise<LabelsResponseData> => {
  const labels: LabelsResponseData = [];

  const pageCount = await getLabelsPageCount(options);

  const _options = objectValueFilterAndToString(options);

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/labels`;

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
        tags: ["allLabel"],
      },
    });

    labels.push(...Array.from((await response.json()) as LabelsResponseData));
  }

  return labels;
};

const getRepositoryReadme = async (
  owner: string,
  repo: string
): Promise<ReadmeResponseData> => {
  const url = `https://api.github.com/repos/${owner}/${repo}/readme`;

  const response = await fetch(url, {
    cache: "no-cache",
    headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
  });

  return (await response.json()) as ReadmeResponseData;
};

const getAnIssueComment = async (
  commentId: string
): Promise<AnIssueCommentResponseData | undefined> => {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/comments/${commentId}`;

  const response = await fetch(url, {
    cache: "no-cache",
    headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
  });

  if (response.status >= 400) {
    return;
  }

  return (await response.json()) as AnIssueCommentResponseData;
};

export const apiService = {
  getIssues,
  getIssuesPageCount,
  getAllIssue,
  getAnIssue,
  getAnIssueComment,

  getLabelsPageCount,
  getAllLabel,

  getRepositoryReadme,
};
