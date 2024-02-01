import { type Endpoints } from "@octokit/types";

export type IssueListRequestParameters = Omit<
  Endpoints["GET /repos/{owner}/{repo}/issues"]["parameters"],
  "repo" | "owner"
>;

export type IssueListResponse =
  Endpoints["GET /repos/{owner}/{repo}/issues"]["response"];

export type IssueItemResponse =
  Endpoints["GET /repos/{owner}/{repo}/issues/{issue_number}"]["response"];
