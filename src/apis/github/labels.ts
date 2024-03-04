import { GITHUB } from "@/constants";
import { apiUtils } from "@/utils";

export const getLabelsPageCount = async (
  options?: LabelsRequestParameters
): Promise<number> => {
  const _options = apiUtils.objectValueFilterAndToString(options);

  const url = `https://api.github.com/repos/${GITHUB.REPO_OWNER}/${GITHUB.REPO_NAME}/labels`;
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

  const pageCount = apiUtils.getPageCount(
    apiUtils.parseLink(response.headers.get("link"))
  );

  return pageCount;
};

export const getAllLabel = async (
  options?: LabelsRequestParameters
): Promise<LabelsResponseData> => {
  const labels: LabelsResponseData = [];

  const pageCount = await getLabelsPageCount(options);

  const _options = apiUtils.objectValueFilterAndToString(options);

  const url = `https://api.github.com/repos/${GITHUB.REPO_OWNER}/${GITHUB.REPO_NAME}/labels`;

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
