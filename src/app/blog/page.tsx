import { getIssues, getLabels } from "@/apis";
import { IssueList } from "./_components/IssueList";
import { LabelList } from "./_components/LabelList";
import { REPO_OWNER } from "@/constants";

export default async function Blog() {
  const { items: issues, pageCount } = await getIssues({
    per_page: 5,
    creator: REPO_OWNER,
  });
  const labels = await getLabels({ per_page: 2 });

  return (
    <div>
      <LabelList labels={labels} />
      <IssueList issues={issues} />
    </div>
  );
}
