import { MarkdownContent } from "@/components/MarkdownContent";
import { getIssueItem } from "@/apis";
import { ISSUE_PORTFOLIO_NUMBER } from "@/constants";

export default async function Portfolio() {
  const issue = await getIssueItem(ISSUE_PORTFOLIO_NUMBER.toString());

  return (
    <div className="mt-6">
      <MarkdownContent content={issue?.body || ""} />
    </div>
  );
}
