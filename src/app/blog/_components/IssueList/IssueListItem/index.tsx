import { type IssueListResponse } from "@/app/blog/_types/issue";

interface IssueListItemProps {
  issue: IssueListResponse["data"][number];
}

export function IssueListItem({ issue }: IssueListItemProps) {
  return (
    <li className="[&>p]:mb-3.5 border-b border-gray-800">
      <p className="text-sm text-gray-600">
        {new Date(issue.created_at).toLocaleString()}
      </p>

      <p className="text-xl font-semibold">{issue.title}</p>
    </li>
  );
}
