import { MarkdownContent } from "@/components/MarkdownContent";
import { getIssueItem } from "@/apis";
import { ISSUE_ABOUT_NUMBER } from "@/constants";

export default async function Home() {
  const issue = await getIssueItem(ISSUE_ABOUT_NUMBER.toString());

  return (
    <main className="mt-6">
      <MarkdownContent content={issue?.body || ""} />
    </main>
  );
}
