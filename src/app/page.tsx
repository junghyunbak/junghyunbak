import { MarkdownContent } from "@/components/MarkdownContent";
import { apiService, ISSUE_ABOUT_NUMBER } from "@/apis";
import { Metadata } from "next";
import { Hits } from "@/components/Hits";

export const metadata: Metadata = {
  title: "About | 박정현",
};

export default async function Home() {
  const issue = await apiService.getAnIssue(ISSUE_ABOUT_NUMBER.toString());

  return (
    <main className="mt-6">
      <Hits className="ml-auto pb-3.5" path="/" />

      <MarkdownContent content={issue?.body || ""} />
    </main>
  );
}
