import { Toc } from ".";
import { render, screen } from "@testing-library/react";

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
