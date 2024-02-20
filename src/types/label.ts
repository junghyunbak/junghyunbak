import { type Endpoints } from "@octokit/types";

declare global {
  type Labels = Endpoints["GET /repos/{owner}/{repo}/labels"];
  type LabelsResponse = Labels["response"];
  type LabelsResponseData = LabelsResponse["data"];
  type LabelsRequestParameters = Labels["parameters"];
}
