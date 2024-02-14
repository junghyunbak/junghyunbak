import { apiService } from "@/apis";
import { Markdown } from "@/components/Markdown";

interface ReadmeViewerProps {
  owner?: string;
  repo?: string;
}

export async function ReadmeViewer({ owner, repo }: ReadmeViewerProps) {
  if (!owner || !repo) {
    return null;
  }

  const readme = await apiService.getRepositoryReadme(owner, repo);

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
        <Markdown
          markdown={decodeUnicode(readme.content)}
          imageOptimize={false}
        />
      </div>
    </div>
  );
}

function decodeUnicode(str: string) {
  return decodeURIComponent(
    atob(str)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
}
