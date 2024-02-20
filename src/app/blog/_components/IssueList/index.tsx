import { Endpoints } from "@octokit/types";
import { IssueListItem } from "./IssueListItem";
import { type IssuesResponse } from "@/apis";

interface IssueListProps {
  issues:
    | IssuesResponse["data"]
    | Endpoints["GET /search/issues"]["response"]["data"]["items"];
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
