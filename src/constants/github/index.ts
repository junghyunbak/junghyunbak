export const REPO_OWNER = "junghyunbak";
export const REPO_NAME = "junghyunbak";

export const ISSUE_PER_PAGE = 10;
export const ISSUE_ABOUT_NUMBER = 18;
export const ISSUE_PORTFOLIO_NUMBER = 19;
export const ISSUE_REQUEST_DEFAULT_OPTIONS: IssuesCoreRequestParameters = {
  per_page: ISSUE_PER_PAGE,
  /**
   * 레포지토리 이슈에 다른 사람이 글을 쓸 경우의 대비
   */
  creator: REPO_OWNER,
};
