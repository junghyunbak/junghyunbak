import { type Endpoints } from "@octokit/types";

declare global {
  type Readme = Endpoints["GET /repos/{owner}/{repo}/readme"];
  type ReadmeResponse = Readme["response"];
  type ReadmeResponseData = ReadmeResponse["data"];
}
