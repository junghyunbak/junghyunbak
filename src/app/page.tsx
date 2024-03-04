import { GITHUB } from "@/constants";
import { Metadata } from "next";
import { Hits } from "@/components/core/Hits";
import { Header } from "@/components/core/Header";
import { Issue } from "@/components/widget/Issue";
import { RecentIssueList } from "@/components/core/RecentIssueList";
import {
  extractImageUrlsFromMarkdown,
  getImageUrlToPreviewImageData,
} from "@/utils/image";
import { ResponsivePaddingLayout } from "@/components/layout/ResponsivePaddingLayout";

/**
 * 최근 업데이트 한 게시물을 주기적으로 가져와야 하기 때문에,
 *
 * on-demand revalidation -> time based revalidation 으로 설정함.
 */
export const revalidate = 60;

export const metadata: Metadata = {
  title: "About | 개발자 박정현",
};

export default async function Home() {
  const issue = (await fetch(
    `https://api.github.com/repos/${GITHUB.REPO_OWNER}/${GITHUB.REPO_NAME}/issues/${GITHUB.ISSUE_ABOUT_NUMBER}`,
    {
      headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
    }
  )
    .then((res) => res.json())
    .catch(() => null)) as AnIssueResponseData | null;

  const recentIssues = (await fetch(
    `https://api.github.com/repos/${GITHUB.REPO_OWNER}/${GITHUB.REPO_NAME}/issues?creator=${GITHUB.REPO_OWNER}&assignee=none&per_page=3&sort=updated`,
    {
      headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
    }
  )
    .then((res) => res.json())
    .catch(() => [])) as Issues;

  const imageUrls = extractImageUrlsFromMarkdown(issue?.body || "");
  const imageUrlToPreviewImage = await getImageUrlToPreviewImageData(imageUrls);

  return (
    <>
      <Header currentPage="소개" />

      <ResponsivePaddingLayout>
        <div className="mt-6">
          <Hits path="/" />
        </div>

        <Issue
          markdown={issue?.body || ""}
          number={GITHUB.ISSUE_ABOUT_NUMBER}
          imageUrlToPreviewImage={imageUrlToPreviewImage}
          moreContent={<RecentIssueList recentIssues={recentIssues} />}
        />
      </ResponsivePaddingLayout>
    </>
  );
}
