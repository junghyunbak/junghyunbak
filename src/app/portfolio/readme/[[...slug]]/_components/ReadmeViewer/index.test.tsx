import { getReadmeMarkdown } from ".";
import fetchMock from "jest-fetch-mock";
import base64 from "base-64";
import utf8 from "utf8";

fetchMock.enableMocks();

const MOCK_OWNER_NAME = "junghyunbak";
const MOCK_REPO_NAME = "gitub-issues-viewer";

fetchMock.mockResponse((request) => {
  const match = /https:\/\/api.github.com\/repos\/(.*)\/(.*)\/readme/.exec(
    request.url
  );

  const [_, owner, repo] = match || [];

  if (owner !== MOCK_OWNER_NAME || repo !== MOCK_REPO_NAME) {
    return Promise.reject({
      status: 404,
    });
  }

  return Promise.resolve({
    body: JSON.stringify({
      content: base64.encode(
        utf8.encode("유니코드가 포함된 문자열 base64-encoding-data")
      ),
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
});

it("올바르지 않은 레포지토리 소유자와 이름을 입력하였을 때, 에러 문자열을 반환한다.", async () => {
  const WRONG_OWNER = "wrong owner";
  const WRONG_REPO = "wrong repository";

  expect(await getReadmeMarkdown(WRONG_OWNER, WRONG_REPO)).toEqual(
    `${WRONG_OWNER} / ${WRONG_REPO} 레포지토리가 존재하지 않습니다.`
  );
});

it("유니코드가 포함 된 base64 인코딩 데이터를 올바르게 디코딩한다.", async () => {
  const markdown = await getReadmeMarkdown(MOCK_OWNER_NAME, MOCK_REPO_NAME);

  expect(markdown).toContain("유니코드");
});
