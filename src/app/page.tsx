import { ISSUE_ABOUT_NUMBER, REPO_OWNER, REPO_NAME } from "@/apis";
import { Metadata } from "next";
import { Hits } from "@/components/Hits";
import { Utterances } from "@/components/Utterances";
import { Markdown } from "@/components/Markdown";
import { Header } from "@/components/Header";
import Link from "next/link";

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

  return (
    <>
      <Header currentPage="소개" />

      <main className="mt-6 max-md:p-3">
        <Hits path="/" />

        <Markdown markdown={issue?.body || ""} />

        <h2 className="mb-6 text-2xl font-semibold border-b border-black">
          최근 업데이트 한 게시물
        </h2>

        <ul className="pl-8 mb-6">
          {recentIssues.map((issue) => {
            return (
              <li key={issue.id} className="list-disc">
                <Link
                  href={`/post/${issue.number}`}
                  className="hover:underline underline-offset-2"
                >
                  {issue.title}
                  <span className="text-gray-600">{` (${MillisecondsToElapsedTimeString(
                    Date.now() - new Date(issue.updated_at).getTime()
                  )} 전)`}</span>
                </Link>
              </li>
            );
          })}

          <li className="list-disc">
            <Link
              href={`/blog/search?sort=updated&order=desc`}
              className="hover:underline underline-offset-2"
            >
              ...더보기
            </Link>
          </li>
        </ul>

        <Utterances issueNumber={ISSUE_ABOUT_NUMBER} />
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
