import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeExtractToc, {
  type TocEntry,
} from "@stefanprobst/rehype-extract-toc";
import rehypeStringify from "rehype-stringify";
import { isTocNode } from "./index.types";

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

  if (!(toc instanceof Array)) {
    return null;
  }

  if (
    !isTocNode(toc) ||
    !toc.reduce((a, c) => (a + c.depth <= MAX_TOC_DEPTH ? 1 : 0), 0)
  ) {
    return;
  }

  return (
    <div className="p-3.5 mb-6 bg-secondaryB border border-gray-800 rounded">
      {createTocList(toc)}
    </div>
  );
}

function createTocList(nodes: TocEntry[]) {
  return (
    <ul className="pl-8 list-[revert]">
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
    </ul>
  );
}
