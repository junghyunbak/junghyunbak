import { getReadmeMarkdown } from ".";
import fetchMock from "jest-fetch-mock";
import base64 from "base-64";
import utf8 from "utf8";

fetchMock.enableMocks();

it("유니코드가 포함 된 base64 인코딩 데이터를 올바르게 디코딩한다.", async () => {
  fetchMock.mockResponseOnce(
    JSON.stringify({
      content: base64.encode(
        utf8.encode("유니코드가 포함된 문자열 base64-encoding-data")
      ),
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const markdown = await getReadmeMarkdown("", "");

  expect(markdown).toContain("유니코드");
});
