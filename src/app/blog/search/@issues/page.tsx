"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { type Endpoints } from "@octokit/types";
import { Octokit } from "octokit";
import {
  IsSeacrhOptionValue,
  IsOrderOptionValue,
  IsSortOptionValue,
} from "../@form/page";
import { IssueList } from "../../_components/IssueList";
import { REPO_NAME, REPO_OWNER } from "@/apis";

const octokit = new Octokit();

/**
 * TODO: pagination 혹은 무한스크롤 구현
 *
 * 현재는 한 페이지, 100개만을 가져오는 상태
 */
export default function SearchIssues() {
  const searchParams = useSearchParams();

  const [issues, setIssues] = useState<
    Endpoints["GET /search/issues"]["response"]["data"]["items"]
  >([]);

  useEffect(() => {
    (async () => {
      const searchParam = searchParams.get("search");
      const sortParam = searchParams.get("sort");
      const orderParam = searchParams.get("order");
      const keywordParam = searchParams.get("keyword");

      const {
        data: { items },
      } = await octokit.rest.search.issuesAndPullRequests({
        q: `type:issue ${IsSeacrhOptionValue(searchParam) ? searchParam : ""} ${
          keywordParam || ""
        } user:${REPO_OWNER} repo:${REPO_OWNER}/${REPO_NAME} no:assignee author:${REPO_OWNER}`,
        sort: IsSortOptionValue(sortParam) ? sortParam : "updated",
        order: IsOrderOptionValue(orderParam) ? orderParam : "desc",
      });

      setIssues(items);
    })();
  }, [searchParams]);

  return (
    <div className="mb-12">
      <div className="mt-11">
        <p className="text-xl font-semibold">총 {issues.length}개의 검색결과</p>
      </div>

      <IssueList issues={issues} />
    </div>
  );
}
