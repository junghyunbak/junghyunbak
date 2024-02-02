import { MarkdownContent } from "@/components/MarkdownContent";
import { getIssueItem } from "@/apis";

export default async function Home() {
  const issue = await getIssueItem("18");

  return (
    <main className="mt-6">
      <MarkdownContent content={issue?.body || ""} />
    </main>
  );
}
