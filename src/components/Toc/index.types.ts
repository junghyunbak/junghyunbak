import { type TocEntry } from "@stefanprobst/rehype-extract-toc";

export function isTocNode(nodes: any[]): nodes is TocEntry[] {
  return nodes.every((node) => {
    const childrenValid =
      node.children instanceof Array ? isTocNode(node.children) : true;

    const valueValid = typeof node.value === "string";

    const depthValid = typeof node.depth === "number";

    return childrenValid && valueValid && depthValid;
  });
}
