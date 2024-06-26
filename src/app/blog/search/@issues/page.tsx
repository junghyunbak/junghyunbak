"use client";

import { useSearchParams } from "next/navigation";
import { Octokit } from "octokit";
import {
  isSeacrhOptionValue,
  isOrderOptionValue,
  isSortOptionValue,
} from "../_utils/typeGuard";
import { IssueList } from "@/components/core/IssueList";
import { GITHUB } from "@/constants";
import { useQuery } from "react-query";

const octokit = new Octokit({
  throttle: { enabled: false },
});

// TODO: pagination 혹은 무한스크롤을 구현한다. 현재는 한 페이지(100개)만을 가져오는 상태
export default function SearchIssues() {
  const searchParams = useSearchParams();

  const searchParam = searchParams.get("search");
  const sortParam = searchParams.get("sort");
  const orderParam = searchParams.get("order");
  const keywordParam = searchParams.get("keyword");

  const query = [
    "type:issue",
    `repo:${GITHUB.REPO_OWNER}/${GITHUB.REPO_NAME}`,
    'state:open',
    `author:${GITHUB.REPO_OWNER}`,
  ];

  if (isSeacrhOptionValue(searchParam)) {
    query.push(searchParam);
  }

  if (keywordParam) {
    query.push(keywordParam);
  }

  const { data: issues } = useQuery<IssuesSearchResponseData>(
    [keywordParam, searchParam, sortParam, orderParam],
    async () => {
      const {
        data: { items },
      } = await octokit.rest.search.issuesAndPullRequests({
        q: query.join(" "),
        sort: isSortOptionValue(sortParam) ? sortParam : "created",
        order: isOrderOptionValue(orderParam) ? orderParam : "desc",
      });

      return items;
    },
    {
      suspense: true,
      useErrorBoundary: true,
    }
  );

  if (!issues) {
    return null;
  }

  return (
    <>
      <p className="text-xl font-semibold">총 {issues.length}개의 검색 결과</p>

      <IssueList issues={issues} />
    </>
  );
}
