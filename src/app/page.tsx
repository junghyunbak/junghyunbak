import { ISSUE_ABOUT_NUMBER, REPO_OWNER, REPO_NAME } from "@/apis";
import { Metadata } from "next";
import { Hits } from "@/components/Hits";
import { Header } from "@/components/Header";
import Link from "next/link";
import { Issue } from "@/components/widgets/Issue";
import { extractImageUrlsFromMarkdown, getImageUrlToPreviewImageData } from "@/utils/image";

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
          moreContent={<RecentIssueList recentIssues={recentIssues}/>}
        />
      </main>
    </>
  );
}

function MillisecondsToElapsedTimeString(ms: number) {
  const minute = Math.floor(ms / 1000 / 60);

  if (!minute) {
    return "방금";
  }

  const hour = Math.floor(minute / 60);

  if (!hour) {
    return `${minute}분`;
  }

  const date = Math.floor(hour / 24);

  if (!date) {
    return `${hour}시간`;
  }

  const week = Math.floor(date / 7);

  if (!week) {
    return `${date}일`;
  }

  const month = Math.floor(week / 4);

  if (!month) {
    return `${week}주일`;
  }

  const year = Math.floor(month / 12);

  if (!year) {
    return `${month}월`;
  }

  return `${year}년`;
}

interface RecentIssueListProps {
  recentIssues: Issues;
}

function RecentIssueList({ recentIssues }: RecentIssueListProps) {
  return (
    <div className="markdown">
      <h2>최근 업데이트 한 게시물</h2>

      <ul>
        {recentIssues.map((issue) => {
          return (
            <li key={issue.id}>
              <Link href={`/post/${issue.number}`}>
                {issue.title}
                <span className="text-gray-600">{` (${MillisecondsToElapsedTimeString(
                  Date.now() - new Date(issue.updated_at).getTime()
                )} 전)`}</span>
              </Link>
            </li>
          );
        })}

        <li>
          <Link href={`/blog/search?sort=updated&order=desc`}>...더보기</Link>
        </li>
      </ul>
    </div>
  );
}
