import {
  extractImageUrlsFromMarkdown,
  getImageUrlToPreviewImageData,
} from ".";
import fs from "fs";
import { join } from "path";
import fetchMock from "jest-fetch-mock";

const fileBuffer = fs.readFileSync(join(__dirname, "profile.png"));

fetchMock.enableMocks();
fetchMock.mockResponse(async (request) => {
  if (request.url.startsWith("https://mockapi/image")) {
    return {
      /**
       * https://github.com/jefflau/jest-fetch-mock/issues/218
       */
      body: fileBuffer as unknown as string,
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

![image3](https://mockapi/wrong/url)

<img src="https://mockapi/image/4" alt="image4"/>

<iframe src="https://mockapi/not/image"/>
`;

it("마크다운에서 모든 웹 url 링크를 정상적으로 추출한다.", () => {
  const urls = extractImageUrlsFromMarkdown(markdown);

  expect(urls.length).toBe(5);
});

it("이미지 관련 url이 아닐경우 미리보기 이미지 Map 객체에 포함되지 않도록 한다.", async () => {
  const urls = extractImageUrlsFromMarkdown(markdown);

  const imageUrlToPreviewImageData = await getImageUrlToPreviewImageData(urls);

  expect(imageUrlToPreviewImageData.size).toBe(2);
});
