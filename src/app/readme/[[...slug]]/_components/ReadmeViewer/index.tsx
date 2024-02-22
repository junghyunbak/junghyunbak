import { apiService } from "@/apis";
import { Markdown } from "@/components/Markdown";
import base64 from "base-64";
import utf8 from "utf8";

interface ReadmeViewerProps {
  owner?: string;
  repo?: string;
}

export async function ReadmeViewer({ owner, repo }: ReadmeViewerProps) {
  if (!owner || !repo) {
    return null;
  }

  const markdown = await getReadmeMarkdown(owner, repo);

  return (
    <div className="flex h-[80dvh] w-[90dvw] flex-col bg-white lg:w-[60rem]">
      <div className="border-b border-gray-300 p-4">
        <p className="[&_a]:text-clickable">
          <a href={`https://github.com/${owner}`} target="_blank">
            {owner}
          </a>
          {" / "}
          <a href={`https://github.com/${owner}/${repo}`} target="_blank">
            {repo}
          </a>
          {" - README.md"}
        </p>
      </div>

      <div className="flex-1 overflow-y-scroll p-8">
        {/**
         * https://github.com/vercel/next.js/issues/52842
         *
         * `intercepting route`를 위한 parallel 경로에서 정적 페이지 생성이 되지 않는 이슈가 있어,
         * 빠른 로딩을 위해 이미지 최적화 옵션을 끔
         */}
        <Markdown markdown={markdown} imageOptimize={false} />
      </div>
    </div>
  );
}

export async function getReadmeMarkdown(owner: string, repo: string) {
  try {
    const readme = await apiService.getRepositoryReadme(owner, repo);

    return utf8.decode(base64.decode(readme.content));
  } catch (e) {
    return `${owner} / ${repo} 레포지토리가 존재하지 않습니다.`;
  }
}
