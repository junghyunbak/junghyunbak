import { MarkdownContent } from "@/components/MarkdownContent";
import { ISSUE_ABOUT_NUMBER } from "@/constants";
import { apiService } from "@/apis";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | 박정현",
};

export default async function Home() {
  const issue = await apiService.getAnIssue(ISSUE_ABOUT_NUMBER.toString());

  return (
    <main className="mt-6">
      <MarkdownContent content={issue?.body || ""} />
    </main>
  );
}
