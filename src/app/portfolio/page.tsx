import { apiService, ISSUE_PORTFOLIO_NUMBER } from "@/apis";
import { Metadata } from "next";
import { Hits } from "@/components/cores/Hits";
import { Issue } from "@/components/widgets/Issue";
import {
  extractImageUrlsFromMarkdown,
  getImageUrlToPreviewImageData,
} from "@/utils/image";

export const metadata: Metadata = {
  title: "Portfolio | 개발자 박정현",
};

export default async function Portfolio() {
  const issue = await apiService.getAnIssue(ISSUE_PORTFOLIO_NUMBER.toString());

  const imageUrls = extractImageUrlsFromMarkdown(issue?.body || "");
  const imageUrlToPreviewImage = await getImageUrlToPreviewImageData(imageUrls);

  return (
    <div className="mt-6">
      <Hits path="/portfolio" />

      <Issue
        markdown={issue?.body || ""}
        number={ISSUE_PORTFOLIO_NUMBER}
        imageUrlToPreviewImage={imageUrlToPreviewImage}
      />
    </div>
  );
}
