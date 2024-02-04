import { MarkdownContent } from "@/components/MarkdownContent";
import { apiService } from "@/apis";
import { ISSUE_PORTFOLIO_NUMBER } from "@/constants";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio | 박정현",
};

export default async function Portfolio() {
  const issue = await apiService.getAnIssue(ISSUE_PORTFOLIO_NUMBER.toString());

  return (
    <div className="mt-6">
      <MarkdownContent content={issue?.body || ""} />
    </div>
  );
}
