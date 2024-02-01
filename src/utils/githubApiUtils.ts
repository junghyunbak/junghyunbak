import parse from "parse-link-header";

/**
 * github api에서 제공하는 링크 헤더 요소로 `parseLinkHeader` 모듈 타입 덮어쓰기
 */
declare namespace parseLinkHeader {
  interface Link {
    page: string;
    per_page: string;
  }

  interface Links {
    first?: Link;
    prev?: Link;
    next?: Link;
    last?: Link;
  }
}

export const parseLink = (
  linkHeader: string | null
): parseLinkHeader.Links | null => {
  return parse(linkHeader);
};

export const isLastPage = (pageLinks: parseLinkHeader.Links): boolean => {
  if (Object.keys(pageLinks).length !== 2) {
    return false;
  }

  if (!pageLinks.first) {
    return false;
  }

  if (!pageLinks.prev) {
    return false;
  }

  return true;
};

export const getPageCount = (
  pageLinks: parseLinkHeader.Links | null,
  dataLength: number
): number => {
  if (!pageLinks) {
    return dataLength === 0 ? 0 : 1;
  }

  if (isLastPage(pageLinks) && pageLinks.prev) {
    return parseInt(pageLinks.prev.page, 10) + 1;
  } else if (pageLinks.last) {
    return parseInt(pageLinks.last.page, 10);
  } else {
    return 1;
  }
};
