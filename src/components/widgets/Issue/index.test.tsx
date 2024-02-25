import { Issue, type Frontmatter } from ".";
import { render, screen } from "@testing-library/react";

it("이미지 최적화 frontmatter값이 false인 경우 width, height값이 설정된 이미지 태그가 없어야 한다.", () => {
  const fakeIssueNumber = 1;
  const fakeImageWidth = 20;
  const fakeImageHeight = 20;
  const fakeImageAlt = "image";
  const fakeImageUrl = "/test";

  /**
   * ※ toml 시작, 끝을 나타내는 `+++` 앞에 공백이 존재할 경우 올바르게 동작하지 않음에 유의.
   */
  const markdown = `+++\nimageOptimize = false\n+++
    
  ![${fakeImageAlt}](${fakeImageUrl});
  `;

  const imageUrlToPreviewImage: Map<string, PreviewImage> = new Map([
    [
      fakeImageUrl,
      {
        width: fakeImageWidth,
        height: fakeImageHeight,
        base64: `data:image/jpeg;base64,`,
      },
    ],
  ]);

  render(
    <Issue
      number={fakeIssueNumber}
      markdown={markdown}
      imageUrlToPreviewImage={imageUrlToPreviewImage}
    />
  );

  const image = screen.getByAltText(fakeImageAlt);

  expect(image.getAttribute("width")).toBe(null);
});

it("이미지 최적화 frontmatter값이 true(기본값)인 경우 width, height값이 설정된 이미지 태그가 있어야 한다.", () => {
  const fakeIssueNumber = 1;
  const fakeImageWidth = 20;
  const fakeImageHeight = 20;
  const fakeImageAlt = "image";
  const fakeImageUrl = "/test";

  const markdown = `+++\nimageOptimize = true\n+++
    
  ![${fakeImageAlt}](${fakeImageUrl});
  `;

  const imageUrlToPreviewImage: Map<string, PreviewImage> = new Map([
    [
      fakeImageUrl,
      {
        width: fakeImageWidth,
        height: fakeImageHeight,
        base64: `data:image/jpeg;base64,`,
      },
    ],
  ]);

  render(
    <Issue
      number={fakeIssueNumber}
      markdown={markdown}
      imageUrlToPreviewImage={imageUrlToPreviewImage}
    />
  );

  const image = screen.getByAltText(fakeImageAlt);

  expect(image.getAttribute("width")).toBe(fakeImageWidth.toString());
  expect(image.getAttribute("height")).toBe(fakeImageHeight.toString());
});

it("이미지 요소를 `inline`으로 설정하는 옵션이 true일 경우, 이미지 요소의 display값이 `inline`이어야 한다.", () => {
  const fakeIssueNumber = 1;
  const fakeImageAlt = "image";
  const fakeImageUrl = "/test";

  const markdown = `+++\nimageInline = true\n+++
    
  ![${fakeImageAlt}](${fakeImageUrl});
  `;

  render(<Issue number={fakeIssueNumber} markdown={markdown} />);

  const image = screen.getByAltText(fakeImageAlt);

  expect(image.getAttribute("style")?.includes("inline")).toBe(true);
});

it("댓글 컴포넌트를 비활성화처리하는 옵션을 true로 설정할 경우, utterances iframe이 렌더링되지 않아야 한다.", () => {
  const fakeIssueNumber = 1;

  const markdown = `+++\ninactivateComments = true\n+++`;

  const { container } = render(
    <Issue number={fakeIssueNumber} markdown={markdown} />
  );

  expect(container.innerHTML.includes("utteranc")).toBe(false);
});

it("목차 컴포넌트를 비활성화처리하는 옵션을 true로 설정할 경우, 목차 컴포넌트가 렌더링되지 않아야 한다.", () => {
  const fakeIssueNumber = 1;

  const markdown = `+++\ninactivateToc = true\n+++

  # h1
  ## h2
  ### h3
  #### h4
  ##### h5
  ###### h6
  `;

  const { container } = render(
    <Issue number={fakeIssueNumber} markdown={markdown} />
  );

  expect(container.innerHTML.includes("목차")).toBe(false);
});

it("목차 컴포넌트의 최대 depth를 1로 설정할 경우 heading 2, 3은 렌더링되지 않아야 한다.", () => {
  const fakeIssueNumber = 1;

  const markdown = `+++\nmaxDepthOfToc = 1\n+++

  # h1
  ## h2
  ### h3
  #### h4
  ##### h5
  ###### h6
  `;

  render(<Issue number={fakeIssueNumber} markdown={markdown} />);

  expect(screen.queryByRole("link", { name: "h1" })).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "h2" })).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "h3" })).not.toBeInTheDocument();
});

it("frontmatter값이 전달되지 않았을 경우, 기본값으로 올바르게 렌더링한다.", () => {
  const fakeIssueNumber = 1;
  const fakeImageAlt = "image";
  const fakeImageUrl = "/test";
  const fakeImageWidth = 20;
  const fakeImageHeight = 20;

  const markdown = `
  # h1
  ## h2
  ### h3
  #### h4

  ![${fakeImageAlt}](${fakeImageUrl})
  `;

  const imageUrlToPreviewImage: Map<string, PreviewImage> = new Map([
    [
      fakeImageUrl,
      {
        width: fakeImageWidth,
        height: fakeImageHeight,
        base64: `data:image/jpeg;base64,`,
      },
    ],
  ]);

  const { container } = render(
    <Issue
      markdown={markdown}
      number={fakeIssueNumber}
      imageUrlToPreviewImage={imageUrlToPreviewImage}
    />
  );

  const image = screen.getByAltText(fakeImageAlt);

  expect(container.innerHTML.includes("목차")).toBe(true);
  expect(container.innerHTML.includes("utteranc")).toBe(true);
  expect(screen.queryByRole("link", { name: "h4" })).not.toBeInTheDocument();
  expect(image.getAttribute("width")).toBe(fakeImageWidth.toString());
  expect(image.getAttribute("height")).toBe(fakeImageHeight.toString());
  expect(image.getAttribute("style")?.includes("inline")).toBe(false);
});

it('frontmatter로 전달된 타입이 올바르지 않은 경우, "올바르지 않은 frontmatter를 입력하였습니다."라는 문자를 렌더링한다.', () => {
  const fakeIssueNumber = 1;

  const frontmatters: Frontmatter = {
    // @ts-expect-error
    imageInline: 1,
    // @ts-expect-error
    imageOptimize: '"hi"',
    // @ts-expect-error
    inactivateComments: 9999,
    // @ts-expect-error
    inactivateToc: '""',
    // @ts-expect-error
    maxDepthOfToc: true,

    unknownFrontmatterKey: '"value"',
  };

  const frontmatterString = Object.entries(frontmatters)
    .map(([key, value]) => `${key} = ${value}`)
    .join("\n");

  const markdown = `+++\n${frontmatterString}\n+++

  # h1
  ## h2
  ### h3
  #### h4
  `;

  const { container } = render(
    <Issue number={fakeIssueNumber} markdown={markdown} />
  );

  expect(container.innerHTML.includes("올바르지 않은 frontmatter")).toBe(true);
});
