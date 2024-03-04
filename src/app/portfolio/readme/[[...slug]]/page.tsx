import { apiService } from "@/apis";
import { Markdown } from "@/components/core/Markdown";
import Link from "next/link";
import base64 from "base-64";
import utf8 from "utf8";

/**
 * 블로그 데이터를 저장하고 있는 레포지토리가 아닌, 다른 레포지토리의 데이터(readme)를 조회하는 페이지이기 때문에,
 * 동적 라우트로 페이지가 구성이 된다.
 *
 * 이러한 상황에서 이미지 데이터(너비, 높이)를 사전에 불러와 활용하는 이미지 최적화 작업이 매 요청마다 이루어질 경우,
 * 로딩시간이 매우 오래 걸리기 때문에 이미지 최적화 옵션을 비활성화 처리함.
 */
export default async function ReadmePage({
  params: { slug = [] },
}: {
  params: { slug: string[] };
}) {
  const [owner, repo] = slug;

  const readme = await apiService.getRepositoryReadme(owner, repo);

  if (!readme) {
    return <p>레포지토리가 존재하지 않습니다.</p>;
  }

  const markdown = utf8.decode(base64.decode(readme.content));

  return (
    <>
      <div className="mx-2 mb-8 mt-2">
        <Link
          className="underline-offset-4 hover:underline"
          href={`/portfolio`}
        >
          ← 포트폴리오 페이지 이동
        </Link>
      </div>

      <Markdown markdown={markdown} imageOptimize={false} imageInline={true} />
    </>
  );
}
