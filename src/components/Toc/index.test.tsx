import { type TocEntry } from "@stefanprobst/rehype-extract-toc";
import { isTocNode } from "./index.types";
import { Toc } from ".";
import { render, screen } from "@testing-library/react";

const tocArray: TocEntry[] = [
  {
    depth: 1,
    value: "h1",
    children: [
      {
        depth: 2,
        value: "h2",
        id: "h2",
      },
    ],
  },
];

const wrongTocArray: any[] = [
  {
    depth: 1,
    value: "h1",
  },
  {
    depth: 1,
  },
];

const wrongTocArray2: any[] = [
  {
    depth: 1,
    value: "h1",
    children: [
      {
        depth: 2,
        value: "h2",
        children: [
          {
            depth: 3,
            value: "h3",
          },
          {
            depth: 3,
          },
        ],
      },
    ],
  },
];

describe("TOC 타입가드 함수", () => {
  it("TOC 객체가 올바른 경우 true를 반환한다.", () => {
    expect(isTocNode(tocArray)).toEqual(true);
  });

  it("TOC 객체 중 value가 존재하지 않는 요소가 있을 경우 false를 반환한다.", () => {
    expect(isTocNode(wrongTocArray)).toEqual(false);
  });

  it("TOC 객체 중 중첩된 객체의 속성이 올바르지 않을 경우 false를 반환한다.", () => {
    expect(isTocNode(wrongTocArray2)).toEqual(false);
  });
});

describe("TOC 컴포넌트", () => {
  it("TOC 컴포넌트가 올바르게 렌더링되는지 확인한다.", () => {
    const markdownText = "## h2\n\n안녕하세요\n\n### h3\n\n반갑습니다.";

    render(<Toc markdown={markdownText} />);

    const linkEl = screen.getByRole("link", { name: "h2" });

    expect(linkEl.getAttribute("href")).toEqual("#h2");
  });

  it("마크다운 요소 중 heading 4 요소는 렌더링되지 않아야 한다.", () => {
    const markdownText =
      "## h2\n\n안녕하세요\n\n### h3\n\n반갑습니다.\n\n#### h4";

    render(<Toc markdown={markdownText} />);

    expect(screen.queryByRole("link", { name: "h4 " })).toEqual(null);
  });
});
