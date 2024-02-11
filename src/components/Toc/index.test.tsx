import { Toc } from ".";
import { render, screen } from "@testing-library/react";

const markdownText = `
## h2

안녕하세요,

## heading 2

반갑습니다.

### h3

테스트입니다.

#### h4

안녕히가세요.
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

it("렌더링 할 최대 heading 요소가 깊이가 2일 때, heading 2 요소까지만 렌더링 되어야 한다.", () => {
  const { container } = render(<Toc markdown={markdownText} maxDepth={2} />);

  console.log(container.innerHTML);

  expect(screen.queryByRole("link", { name: "h2" })).not.toEqual(null);
  expect(screen.queryByRole("link", { name: "h3" })).toEqual(null);
});
