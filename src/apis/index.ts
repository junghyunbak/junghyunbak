import { REPO_NAME, REPO_OWNER } from "@/constants";
import parseLink from "parse-link-header";

import { type Endpoints } from "@octokit/types";

export type IssuesRequestParameters = Omit<
  Endpoints["GET /repos/{owner}/{repo}/issues"]["parameters"],
  "repo" | "owner"
>;

export type IssuesResponse =
  Endpoints["GET /repos/{owner}/{repo}/issues"]["response"];

export type AnIssueResponse =
  Endpoints["GET /repos/{owner}/{repo}/issues/{issue_number}"]["response"];

export type LabelsRequestParameters = Omit<
  Endpoints["GET /repos/{owner}/{repo}/labels"]["parameters"],
  "repo" | "owner"
>;

export type LabelsResponse =
  Endpoints["GET /repos/{owner}/{repo}/labels"]["response"];

/**
 * 유틸 함수
 */
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

/**
 * api 메서드
 */
const getIssues = async (
  options?: IssuesRequestParameters
): Promise<IssuesResponse["data"]> => {
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

  return data as IssuesResponse["data"];
};

const getIssuesPageCount = async (
  options?: IssuesRequestParameters
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
  options?: IssuesRequestParameters
): Promise<IssuesResponse["data"]> => {
  const issues: IssuesResponse["data"] = [];

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
      ...Array.from((await response.json()) as IssuesResponse["data"])
    );
  }

  return issues;
};

const getAnIssue = async (
  issueNumber: string
): Promise<AnIssueResponse["data"] | null> => {
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

  return data as AnIssueResponse["data"];
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
): Promise<LabelsResponse["data"]> => {
  const labels: LabelsResponse["data"] = [];

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

    labels.push(
      ...Array.from((await response.json()) as LabelsResponse["data"])
    );
  }

  return labels;
};

export const apiService = {
  getIssues,
  getIssuesPageCount,
  getAllIssue,
  getAnIssue,

  getLabelsPageCount,
  getAllLabel,
};
