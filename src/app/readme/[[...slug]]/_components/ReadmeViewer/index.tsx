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
    <ReadmeViewerPresenter owner={owner} repo={repo} markdown={markdown} />
  );
}

interface ReadmeViewerPresenterProps {
  owner: string;
  repo: string;
  markdown: string;
}

export function ReadmeViewerPresenter({
  owner,
  repo,
  markdown,
}: ReadmeViewerPresenterProps) {
  return (
    <div className="bg-white w-[90dvw] h-[80dvh] flex flex-col lg:w-[60rem]">
      <div className="p-4 border-b border-gray-300">
        <p className="[&_a]:text-[#00f]">
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

      <div className="flex-1 p-8 overflow-y-scroll">
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
  const readme = await apiService.getRepositoryReadme(owner, repo);

  return utf8.decode(base64.decode(readme.content));
}
