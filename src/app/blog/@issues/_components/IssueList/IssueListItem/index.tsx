import { type IssueListResponse } from "@/types/issue";
import Link from "next/link";

interface IssueListItemProps {
  issue: IssueListResponse["data"][number];
}

export function IssueListItem({ issue }: IssueListItemProps) {
  return (
    <li className="[&>*]:mb-3.5 border-b border-gray-800">
      <p className="text-sm text-gray-600">
        {new Date(issue.created_at).toLocaleString()}
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
