import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeExtractToc, {
  type TocEntry,
} from "@stefanprobst/rehype-extract-toc";
import rehypeStringify from "rehype-stringify";

interface TocProps {
  markdown: string;
  maxDepth?: number;
}

export function Toc({ markdown, maxDepth = 3 }: TocProps) {
  const file = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeExtractToc)
    .use(rehypeStringify)
    .processSync(markdown);

  const {
    data: { toc },
  } = file;

  if (!toc) {
    return null;
  }

  const validTocCount = toc.reduce(
    (a, c) => a + (c.depth <= maxDepth ? 1 : 0),
    0
  );

  if (!validTocCount) {
    return null;
  }

  return (
    <div className="mb-6 w-fit max-w-full rounded-sm border border-gray-300 bg-g20 p-5 pr-8">
      <p className="mb-4 ml-3 font-semibold">목차</p>
      {createTocList(toc, maxDepth)}
    </div>
  );
}

function createTocList(nodes: TocEntry[], maxDepth: number) {
  return (
    <ol className="list-[revert] pl-8">
      {nodes.map((node, i) => {
        if (node.depth > maxDepth) {
          return null;
        }

        return (
          <li key={`toc-list-${node.depth}-${i}`}>
            <a href={`#${node.id}`} className="text-clickable">
              {node.value}
            </a>

            {node.children && createTocList(node.children, maxDepth)}
          </li>
        );
      })}
    </ol>
  );
}
