import { type IssueListResponse } from "@/app/blog/_types/issue";

interface IssueListItemProps {
  issue: IssueListResponse["data"][number];
}

export function IssueListItem({ issue }: IssueListItemProps) {
  return <li>{issue.title}</li>;
}
