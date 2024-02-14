import { apiService } from "@/apis";
import { Markdown } from "@/components/Markdown";
import { RouteModal } from "@/components/RouteModal";

export default async function ReadmeModal({
  params: { slug = [] },
}: {
  params: { slug: string[] };
}) {
  const [owner, repo] = slug;

  /**
   * TODO: null 대신 적절한 UI를 반환한다.
   */
  if (!owner || !repo) {
    return null;
  }

  const readme = await apiService.getRepositoryReadme(owner, repo);

  return (
    <RouteModal>
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
          <Markdown
            markdown={decodeUnicode(readme.content)}
            imageOptimize={false}
          />
        </div>
      </div>
    </RouteModal>
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
