import { ISSUE_ABOUT_NUMBER, REPO_OWNER, REPO_NAME } from "@/apis";
import { Metadata } from "next";
import { Hits } from "@/components/Hits";
import { Header } from "@/components/Header";
import { Issue } from "@/components/widgets/Issue";
import { RecentIssueList } from "@/components/RecentIssueList";
import {
  extractImageUrlsFromMarkdown,
  getImageUrlToPreviewImageData,
} from "@/utils/image";

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
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${ISSUE_ABOUT_NUMBER}`,
    {
      headers: { Authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}` },
    }
  )
    .then((res) => res.json())
    .catch(() => null)) as AnIssueResponseData | null;

  const recentIssues = (await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues?creator=${REPO_OWNER}&assignee=none&per_page=3&sort=updated`,
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

      <main className="mt-6 max-md:p-3">
        <Hits path="/" />

        <Issue
          markdown={issue?.body || ""}
          number={ISSUE_ABOUT_NUMBER}
          imageUrlToPreviewImage={imageUrlToPreviewImage}
          moreContent={<RecentIssueList recentIssues={recentIssues} />}
        />
      </main>
    </>
  );
}
