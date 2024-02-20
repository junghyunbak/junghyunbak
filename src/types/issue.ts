import { type Endpoints } from "@octokit/types";

declare global {
  type AnIssue = Endpoints["GET /repos/{owner}/{repo}/issues/{issue_number}"];
  type AnIssueResponse = AnIssue["response"];
  type AnIssueResponseData = AnIssueResponse["data"];

  type IssuesCore = Endpoints["GET /repos/{owner}/{repo}/issues"];
  type IssuesCoreResponse = IssuesCore["response"];
  type IssuesCoreResponseData = IssuesCoreResponse["data"];
  /**
   * octokit을 사용하지 않고 repo, owner를 url에 직접 작성하기 때문에 제외해준다.
   */
  type IssuesCoreRequestParameters = Omit<
    IssuesCore["parameters"],
    "repo" | "owner"
  >;

  type IssuesSearch = Endpoints["GET /search/issues"];
  type IssuesSearchResponse = IssuesSearch["response"];
  type IssuesSearchResponseData = IssuesSearchResponse["data"]["items"];
  type IssuesSearchRequestParamters = IssuesSearch["parameters"];

  type Issues = IssuesCoreResponseData | IssuesSearchResponseData;

  type Issue =
    | IssuesCoreResponseData[number]
    | IssuesSearchResponseData[number];
}
