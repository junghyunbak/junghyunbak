import _parseLink from "parse-link-header";

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

const isLastPage = (pageLinks: parseLinkHeader.Links): boolean => {
  return Object.keys(pageLinks).length === 2 &&
    pageLinks.first &&
    pageLinks.prev
    ? true
    : false;
};

export const getPageCount = (
  pageLinks: parseLinkHeader.Links | null
): number => {
  /**
   * `pageLinks`가 null인 경우는 다음과 같다.
   *
   * 1. 조건에 맞는 데이터가 존재하지 않을 때
   * 2. 조건에 맞는 데이터의 수가 `per_page`보다 작을 때
   *
   * 항상 페이지 수 0을 반환하게 되면, 2의 경우에서 데이터가 존재하지만 가져오지 못하게 되므로, 페이지 수 1을 반환한다.
   */
  if (!pageLinks) {
    return 1;
  }

  /**
   * 마지막 페이지일 경우 first와 prev 두 가지 링크가 존재한다.
   *
   * 총 페이지 수는 prev에 1을 더한 값이 된다.
   */
  if (isLastPage(pageLinks) && pageLinks.prev) {
    return parseInt(pageLinks.prev.page, 10) + 1;
  }

  /**
   * pageLinks에 last 링크가 존재한다면,
   *
   * 마지막 페이지가 아닌 처음 혹은 중간 페이지가 될 것이고,
   *
   * 총 페이지 수는 last 링크의 값이 된다.
   */
  if (pageLinks.last) {
    return parseInt(pageLinks.last.page, 10);
  }

  /**
   * 페이지가 처음 혹은 마지막에 모두 해당되지 않는 경우는
   *
   * 아무런 데이터가 없다고 해석할 수 있으므로 0을 반환한다.
   */
  return 0;
};

export const parseLink = (linkHeader: string | null) => {
  return _parseLink(linkHeader);
};

export const objectValueFilterAndToString = (
  obj: Record<string, unknown> = {}
): Record<string, string> => {
  const newObj: Record<string, string> = {};

  Object.entries(obj).map(([key, value]) => {
    if (!value) {
      return;
    }

    newObj[key] = value.toString();
  });

  return newObj;
};
