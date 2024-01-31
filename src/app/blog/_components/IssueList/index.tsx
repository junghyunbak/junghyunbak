import { type IssueListResponse } from "@/app/blog/_types/issue";
import { IssueListItem } from "./IssueListItem";

interface IssueListProps {
  issues: IssueListResponse["data"];
}

export function IssueList({ issues }: IssueListProps) {
  return (
    <ul className="flex flex-col gap-4 mt-11">
      {issues.map((issue) => {
        return <IssueListItem key={issue.id} issue={issue} />;
      })}
    </ul>
  );
}
