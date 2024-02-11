import { Markdown } from "@/components/Markdown";
import { apiService, ISSUE_PORTFOLIO_NUMBER } from "@/apis";
import { Metadata } from "next";
import { Hits } from "@/components/Hits";
import { Toc } from "@/components/Toc";

export const metadata: Metadata = {
  title: "Portfolio | 박정현",
};

export default async function Portfolio() {
  const issue = await apiService.getAnIssue(ISSUE_PORTFOLIO_NUMBER.toString());

  return (
    <div className="mt-6">
      <Hits path="/portfolio" />

      <Toc markdown={issue?.body || ""} maxDepth={2} />

      <Markdown markdown={issue?.body || ""} />
    </div>
  );
}
