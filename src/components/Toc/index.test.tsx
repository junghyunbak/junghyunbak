import { Toc } from ".";
import { render, screen } from "@testing-library/react";

const markdownText = `
## h2

안녕하세요,

### h3

반갑습니다.

#### h4

테스트입니다.
`;

it("TOC 컴포넌트가 올바르게 렌더링되는지 확인한다.", () => {
  render(<Toc markdown={markdownText} />);

  const linkEl = screen.getByRole("link", { name: "h2" });

  expect(linkEl.getAttribute("href")).toEqual("#h2");
});

it("마크다운 요소 중 heading 4 요소는 렌더링되지 않아야 한다.", () => {
  render(<Toc markdown={markdownText} />);

  expect(screen.queryByRole("link", { name: "h4" })).toEqual(null);
});
