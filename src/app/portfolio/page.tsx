import { apiService } from "@/apis";
import { GITHUB } from "@/constants";
import { Metadata } from "next";
import { Hits } from "@/components/core/Hits";
import { Issue } from "@/components/widget/Issue";
import { imageUtils } from "@/utils";

export const metadata: Metadata = {
  title: "Portfolio | 개발자 박정현",
};

export default async function Portfolio() {
  const issue = await apiService.getAnIssue(
    GITHUB.ISSUE_PORTFOLIO_NUMBER.toString()
  );

  const imageUrls = imageUtils.extractImageUrlsFromMarkdown(issue?.body || "");
  const imageUrlToPreviewImage = await imageUtils.getImageUrlToPreviewImageData(
    imageUrls
  );

  return (
    <div className="mt-6">
      <Hits path="/portfolio" />

      <Issue
        markdown={issue?.body || ""}
        number={GITHUB.ISSUE_PORTFOLIO_NUMBER}
        imageUrlToPreviewImage={imageUrlToPreviewImage}
      />
    </div>
  );
}
