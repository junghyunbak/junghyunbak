import { apiService } from "@/apis";
import { ModalLayout } from "@/components/layout/ModalLayout";
import { RouteModal } from "@/components/core/RouteModal";
import { ScrollYWithPaddingLayout } from "@/components/layout/ScrollYWithPaddingLayout";
import { Markdown } from "@/components/core/Markdown";
import { Utterances } from "@/components/core/Utterances";

// BUG: https://github.com/vercel/next.js/issues/52842

/**
 * `intercepting route`를 위한 parallel 경로에서 정적 페이지 생성이 되지 않는 이슈가 존재한다.
 *
 * 이러한 상황에서 이미지 데이터(너비, 높이)를 사전에 불러와 활용하는 이미지 최적화 작업이 매 요청마다 이루어질 경우,
 * 로딩시간이 매우 오래 걸리기 때문에 이미지 최적화 옵션을 비활성화 처리함.
 */
export default async function CommentModal({
  params: { id },
}: {
  params: { id: string };
}) {
  const issueComment = await apiService.getAnIssueComment(id);

  if (!issueComment) {
    return <p>해당 이슈의 댓글을 찾을 수 없습니다.</p>;
  }

  return (
    <RouteModal>
      <ModalLayout>
        <ScrollYWithPaddingLayout>
          <Markdown markdown={issueComment.body} imageOptimize={false} />

          <Utterances/>
        </ScrollYWithPaddingLayout>
      </ModalLayout>
    </RouteModal>
  );
}
