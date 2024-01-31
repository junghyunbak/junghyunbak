import { type Endpoints } from "@octokit/types";

export type LabelListRequestParameters = Omit<
  Endpoints["GET /repos/{owner}/{repo}/labels"]["parameters"],
  "repo" | "owner"
>;

export type LabelListResponse =
  Endpoints["GET /repos/{owner}/{repo}/labels"]["response"];
