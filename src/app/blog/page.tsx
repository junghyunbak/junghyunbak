import type {
  IssueListRequestParameters,
  IssueListResponse,
} from "@/app/blog/_types/issue";
import type {
  LabelListRequestParameters,
  LabelListResponse,
} from "@/app/blog/_types/label";
import { IssueList } from "./_components/IssueList";
import { LabelList } from "./_components/LabelList";

const OWNER = "junghyunbak";
const REPO = "junghyunbak";

const getIssues = async (
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
    cache: "no-store",
    headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
  })
    .then((res) => res.json())
    .then((data) => data as IssueListResponse["data"]);

  return data;
};

const getLabels = async (
  options?: LabelListRequestParameters
): Promise<LabelListResponse["data"]> => {
  /**
   * TODO: 라벨 전부 가져오도록 구현
   */
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/labels`;

  const _options: Record<string, string> = {};

  Object.entries({ ...options }).map(([key, value]) => {
    if (!value) {
      return;
    }

    _options[key] = value.toString();
  });

  const queryString = new URLSearchParams(_options);

  const data = await fetch(`${url}?${queryString}`, {
    cache: "no-store",
    headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
  })
    .then((res) => res.json())
    .then((data) => data as LabelListResponse["data"]);

  return data;
};

export default async function Blog() {
  const issues = await getIssues({ per_page: 5 });
  const labels = await getLabels();

  return (
    <div>
      <LabelList labels={labels} />
      <IssueList issues={issues} />
    </div>
  );
}
