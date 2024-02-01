import type {
  IssueListRequestParameters,
  IssueListResponse,
} from "@/types/issue";
import type {
  LabelListRequestParameters,
  LabelListResponse,
} from "@/types/label";
import { githubApiUtils } from "@/utils";

const OWNER = "junghyunbak";
const REPO = "junghyunbak";

export const getIssues = async (
  options?: IssueListRequestParameters
): Promise<IssueListResponse["data"]> => {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/issues`;

  const _options: Record<string, string> = {};

  Object.entries({ ...options }).map(([key, value]) => {
    if (!value) {
      return;
    }

    _options[key] = value.toString();
  });

  const queryString = new URLSearchParams(_options);

  const data = await fetch(`${url}?${queryString}`, {
    cache: "no-cache",
    headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
  })
    .then((res) => res.json())
    .then((data) => data as IssueListResponse["data"]);

  return data;
};

export const getLabels = async (
  options?: LabelListRequestParameters
): Promise<LabelListResponse["data"]> => {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/labels`;

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
      cache: "no-cache",
      headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
    });

    labels.push(
      ...Array.from(
        (await response.json()) as unknown as LabelListResponse["data"]
      )
    );

    pageLinks = githubApiUtils.parseLink(response.headers.get("link"));

    page += 1;
  } while (pageLinks && !githubApiUtils.isLastPage(pageLinks));

  return labels;
};
