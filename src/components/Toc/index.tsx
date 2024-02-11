import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeExtractToc, {
  type TocEntry,
} from "@stefanprobst/rehype-extract-toc";
import rehypeStringify from "rehype-stringify";

const MAX_TOC_DEPTH = 3;

interface TocProps {
  markdown: string;
}

export function Toc({ markdown }: TocProps) {
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
    (a, c) => (a + c.depth <= MAX_TOC_DEPTH ? 1 : 0),
    0
  );

  if (!validTocCount) {
    return;
  }

  return (
    <div className="max-w-full p-5 pr-8 mb-6 border border-gray-300 rounded-sm w-fit bg-g20">
      <p className="mb-4 ml-3 font-semibold">목차</p>
      {createTocList(toc)}
    </div>
  );
}

function createTocList(nodes: TocEntry[]) {
  return (
    <ol className="pl-8 list-[revert]">
      {nodes.map((node, i) => {
        if (node.depth > MAX_TOC_DEPTH) {
          return null;
        }

        return (
          <li key={`toc-list-${node.depth}-${i}`}>
            <a href={`#${node.id}`} className="text-[#0000ff]">
              {node.value}
            </a>

            {node.children && createTocList(node.children)}
          </li>
        );
      })}
    </ol>
  );
}
