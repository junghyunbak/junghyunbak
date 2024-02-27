import Link from "next/link";
import { MillisecondsToElapsedTimeString } from "@/utils/image";

interface RecentIssueListProps {
  recentIssues: Issues;
}

export function RecentIssueList({ recentIssues }: RecentIssueListProps) {
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
