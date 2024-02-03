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
