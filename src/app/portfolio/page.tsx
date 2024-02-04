import { MarkdownContent } from "@/components/MarkdownContent";
import { apiService, ISSUE_PORTFOLIO_NUMBER } from "@/apis";
import { Metadata } from "next";
import { Hits } from "@/components/Hits";

export const metadata: Metadata = {
  title: "Portfolio | 박정현",
};

export default async function Portfolio() {
  const issue = await apiService.getAnIssue(ISSUE_PORTFOLIO_NUMBER.toString());

  return (
    <div className="mt-6">
      <Hits className="ml-auto" path="/portfolio" />

      <MarkdownContent content={issue?.body || ""} />
    </div>
  );
}
