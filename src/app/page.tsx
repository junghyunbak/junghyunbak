import { MarkdownContent } from "@/components/MarkdownContent";
import { apiService, ISSUE_ABOUT_NUMBER } from "@/apis";
import { Metadata } from "next";
import { Hits } from "@/components/Hits";
import { Utterances } from "@/components/Utterances";

export const metadata: Metadata = {
  title: "About | 박정현",
};

export default async function Home() {
  const issue = await apiService.getAnIssue(ISSUE_ABOUT_NUMBER.toString());

  return (
    <main className="mt-6">
      <Hits path="/" />

      <MarkdownContent content={issue?.body || ""} />

      <Utterances issueNumber={ISSUE_ABOUT_NUMBER} />
    </main>
  );
}
