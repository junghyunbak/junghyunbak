import {
  extractUrlsFromMarkdown,
  getImageUrlToPreviewImageData,
  CustomReactMarkdown,
} from ".";
import { render, screen } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
import fs from "fs";
import { join } from "path";

fetchMock.enableMocks();

const fileBuffer = fs.readFileSync(join(__dirname, "profile.png"));

/**
 * `jest-fetch-mock`의 body는 string 타입이지만,
 * 테스트를 해 보았을 때 Buffer 타입의 데이터도 body에 담아 응답이 가능했기 때문에
 * 임시로 ignore 처리 한 후 사용함.
 */
// @ts-ignore
fetchMock.mockResponse(async (request) => {
  if (request.url.startsWith("https://mockapi/image")) {
    return {
      body: fileBuffer,
      headers: { "Content-Type": "image/png" },
    };
  }

  return {
    body: JSON.stringify({ data: "ok" }),
    headers: { "Content-Type": "application/json" },
  };
});

const markdown = `
![image1](https://mockapi/image/1)

![image2]()

<img src="https://mockapi/image/2" alt="image3"/>

<iframe src="https://mockapi/not/image"/>
`;

it("마크다운에서 모든 웹 url 링크를 정상적으로 추출한다.", () => {
  const urls = extractUrlsFromMarkdown(markdown);

  expect(urls.length).toBe(4);
});

it("이미지 관련 url이 아닐경우 미리보기 이미지 Map 객체에 포함되지 않도록 한다.", async () => {
  const urls = extractUrlsFromMarkdown(markdown);

  const imageUrlToPreviewImageData = await getImageUrlToPreviewImageData(urls);

  expect(imageUrlToPreviewImageData.size).toBe(2);
});

it("올바른 url 이미지일 경우에만 화면에 렌더링 되도록 한다.", async () => {
  const urls = extractUrlsFromMarkdown(markdown);

  const imageUrlToPreviewImageData = await getImageUrlToPreviewImageData(urls);

  render(
    <CustomReactMarkdown
      markdown={markdown}
      imageUrlToPreviewImage={imageUrlToPreviewImageData}
    />
  );

  const image1 = screen.queryByAltText("image1");
  const image2 = screen.queryByAltText("image2");
  const image3 = screen.queryByAltText("image3");

  expect(image1).toBeInTheDocument();
  expect(image2).not.toBeInTheDocument();
  expect(image3).toBeInTheDocument();
});
