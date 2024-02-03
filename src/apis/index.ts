import type {
  IssueListRequestParameters,
  IssueListResponse,
  IssueItemResponse,
} from "@/types/issue";
import type {
  LabelListRequestParameters,
  LabelListResponse,
} from "@/types/label";
import { githubApiUtils } from "@/utils";
import { REPO_NAME, REPO_OWNER } from "@/constants";

export const apiService = {
  getAllIssue: async (
    options: IssueListRequestParameters
  ): Promise<IssueListResponse["data"]> => {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`;

    const _options: Record<string, string> = {};

    Object.entries({ ...options }).map(([key, value]) => {
      if (!value) {
        return;
      }

      _options[key] = value.toString();
    });

    const issues: IssueListResponse["data"] = [];

    let page = 1;
    let pageLinks = null;

    /**
     * do while문 지울 수 있음.
     */
    do {
      const queryString = new URLSearchParams({
        ..._options,
        page: page.toString(),
      });

      const response = await fetch(`${url}?${queryString}`, {
        cache: "force-cache",
        headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
      });

      issues.push(
        ...Array.from((await response.json()) as IssueListResponse["data"])
      );

      pageLinks = githubApiUtils.parseLink(response.headers.get("link"));

      page += 1;
    } while (pageLinks && !githubApiUtils.isLastPage(pageLinks));

    return issues;
  },

  getAnIssue: async (
    issueNumber: string
  ): Promise<IssueItemResponse["data"] | null> => {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issueNumber}`;

    const response = await fetch(url, {
      cache: "force-cache",
      headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
      next: {
        tags: [issueNumber],
      },
    });

    if (response.status >= 400) {
      return null;
    }

    const data = await response.json();

    return data as IssueItemResponse["data"];
  },

  getIssues: async (
    options?: IssueListRequestParameters
  ): Promise<{ pageCount: number; items: IssueListResponse["data"] }> => {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`;

    const _options: Record<string, string> = {};

    Object.entries({ ...options }).map(([key, value]) => {
      if (!value) {
        return;
      }

      _options[key] = value.toString();
    });

    const queryString = new URLSearchParams({ ..._options });

    const response = await fetch(`${url}?${queryString}`, {
      cache: "force-cache",
      headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
    });

    const data = await response.json();

    const pageCount = githubApiUtils.getPageCount(
      githubApiUtils.parseLink(response.headers.get("link")),
      data.length
    );

    return { pageCount, items: data as IssueListResponse["data"] };
  },

  getAllLabel: async (
    options?: LabelListRequestParameters
  ): Promise<LabelListResponse["data"]> => {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/labels`;

    const _options: Record<string, string> = {};

    Object.entries({ ...options }).map(([key, value]) => {
      if (!value) {
        return;
      }

      _options[key] = value.toString();
    });

    const labels: LabelListResponse["data"] = [];

    let page = 1;
    let pageLinks = null;

    do {
      const queryString = new URLSearchParams({
        ..._options,
        page: page.toString(),
      });

      const response = await fetch(`${url}?${queryString}`, {
        cache: "force-cache",
        headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
      });

      labels.push(
        ...Array.from((await response.json()) as LabelListResponse["data"])
      );

      pageLinks = githubApiUtils.parseLink(response.headers.get("link"));

      page += 1;
    } while (pageLinks && !githubApiUtils.isLastPage(pageLinks));

    return labels;
  },
};
