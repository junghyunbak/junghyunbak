import { type IssuesResponse } from "@/apis";
import Link from "next/link";

interface IssueListItemProps {
  issue: IssuesResponse["data"][number];
}

export function IssueListItem({ issue }: IssueListItemProps) {
  return (
    <li className="[&>*]:mb-3.5 border-b border-gray-800">
      <p className="text-sm text-gray-600">
        {new Date(issue.created_at).toLocaleString("ko-KR")}
      </p>

      <Link
        className="block text-xl font-semibold"
        href={`/post/${issue.number}`}
      >
        {issue.title}
      </Link>
    </li>
  );
}
