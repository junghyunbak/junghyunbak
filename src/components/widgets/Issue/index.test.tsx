import { Issue } from ".";
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

it("이미지 최적화 frontmatter값을 올바르게 입력하지 않았을 경우, 값이 설정되지 않아 기본값으로 처리된다. (= width, height값이 설정된 이미지 태그가 있어야 한다.)", () => {
  const fakeIssueNumber = 1;
  const fakeImageWidth = 20;
  const fakeImageHeight = 20;
  const fakeImageAlt = "image";
  const fakeImageUrl = "/test";

  const markdown = `+++\nimageOptimize = tue\n+++
    
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
