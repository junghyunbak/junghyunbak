import { getIssues, getLabels } from "@/apis";
import { IssueList } from "./_components/IssueList";
import { LabelList } from "./_components/LabelList";

export default async function Blog() {
  const issues = await getIssues({ per_page: 5 });
  const labels = await getLabels({ per_page: 2 });

  return (
    <div>
      <LabelList labels={labels} />
      <IssueList issues={issues} />
    </div>
  );
}
