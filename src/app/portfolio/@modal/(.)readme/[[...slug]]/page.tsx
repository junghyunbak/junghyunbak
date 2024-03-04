import { RouteModal } from "@/components/core/RouteModal";
import { ReadmeHeader } from "@/app/portfolio/@modal/(.)readme/[[...slug]]/_components/ReadmeHeader";
import { apiService } from "@/apis";
import { ModalLayout } from "@/components/layout/ModalLayout";
import { ScrollYWithPaddingLayout } from "@/components/layout/ScrollYWithPaddingLayout";
import { Markdown } from "@/components/core/Markdown";
import base64 from "base-64";
import utf8 from "utf8";

// BUG: https://github.com/vercel/next.js/issues/52842

/**
 * `intercepting route`를 위한 parallel 경로에서 정적 페이지 생성이 되지 않는 이슈가 존재한다.
 *
 * 이러한 상황에서 이미지 데이터(너비, 높이)를 사전에 불러와 활용하는 이미지 최적화 작업이 매 요청마다 이루어질 경우,
 * 로딩시간이 매우 오래 걸리기 때문에 이미지 최적화 옵션을 비활성화 처리함.
 */
export default async function ReadmeModal({
  params: { slug = [] },
}: {
  params: { slug: string[] };
}) {
  const [owner, repo] = slug;

  const readme = await apiService.getRepositoryReadme(owner, repo);

  return (
    <RouteModal>
      <ModalLayout>
        {!readme ? (
          <p>레포지토리가 존재하지 않습니다.</p>
        ) : (
          (() => {
            const markdown = utf8.decode(base64.decode(readme.content));

            return (
              <>
                <ReadmeHeader owner={owner} repo={repo} />

                <ScrollYWithPaddingLayout>
                  <Markdown
                    markdown={markdown}
                    imageOptimize={false}
                    imageInline={true}
                  />
                </ScrollYWithPaddingLayout>
              </>
            );
          })()
        )}
      </ModalLayout>
    </RouteModal>
  );
}
