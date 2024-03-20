import Link from "next/link";

interface IssueListItemProps {
  issue: Issue;
}

export function IssueListItem({ issue }: IssueListItemProps) {
  return (
    <li className="border-b border-gray-800 [&>*]:mb-3.5">
      <p className="text-sm text-gray-600">
        {new Date(issue.created_at).toLocaleString("ko-KR")}
      </p>

      <Link
        className="block truncate text-xl font-semibold"
        href={`/post/${issue.number}`}
        title={issue.title}
      >
        {issue.title}
      </Link>
    </li>
  );
}
