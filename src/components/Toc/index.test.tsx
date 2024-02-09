import { type TocEntry } from "@stefanprobst/rehype-extract-toc";
import { isTocNode } from "./index.types";

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

describe("toc type guard", () => {
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
