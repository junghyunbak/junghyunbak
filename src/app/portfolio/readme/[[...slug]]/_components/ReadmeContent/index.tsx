import { Markdown } from "@/components/core/Markdown";
import base64 from "base-64";
import utf8 from "utf8";

interface ReadmeContentProps {
  readme: ReadmeResponseData | null;
}

export function ReadmeContent({ readme }: ReadmeContentProps) {
  if (!readme) {
    return <p>레포지토리가 존재하지 않습니다.</p>;
  }

  const markdown = utf8.decode(base64.decode(readme.content));

  // BUG: https://github.com/vercel/next.js/issues/52842
  // `intercepting route`를 위한 parallel 경로에서 정적 페이지 생성이 되지 않는 이슈가 있어, 빠른 로딩을 위해 이미지 최적화 옵션을 끔
  return (
    <Markdown markdown={markdown} imageOptimize={false} imageInline={true} />
  );
}
