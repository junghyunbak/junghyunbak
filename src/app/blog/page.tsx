import type {
  IssueListRequestParameters,
  IssueListResponse,
} from "@/app/blog/_types/issue";
import { IssueList } from "./_components/IssueList";

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

export default async function Blog() {
  const issues = await getIssues({ per_page: 5 });

  return (
    <div>
      <p>블로그 페이지</p>

      <IssueList issues={issues} />
    </div>
  );
}
