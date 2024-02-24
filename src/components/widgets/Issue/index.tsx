import { Markdown } from "@/components/Markdown";
import { Toc } from "@/components/Toc";
import { Utterances } from "@/components/Utterances";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkExtractFrontmatter from "remark-extract-frontmatter";
import remarkStringify from "remark-stringify";
const toml = require("toml").parse;

type Frontmatter = {
  /**
   * @default ""
   */
  description?: string;
  /**
   * @default true
   */
  imageOptimize?: boolean;
  /**
   * @default false
   */
  imageInline?: boolean;
  /**
   * @default false
   */
  inactivateComments?: boolean;
  /**
   * @default false
   */
  inactivateToc?: boolean;
  /**
   * @default 3
   */
  maxDepthOfToc?: number;
};

declare module "vfile" {
  interface DataMap {
    frontmatter: Frontmatter;
  }
}

interface IssueProps {
  number: number;
  markdown: string;
  imageUrlToPreviewImage?: Map<string, PreviewImage>;
}

export function Issue({
  number,
  markdown,
  imageUrlToPreviewImage,
}: IssueProps) {
  const file = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ["toml"])
    .use(remarkExtractFrontmatter, { name: "frontmatter", toml })
    .use(remarkStringify)
    .processSync(markdown);

  const {
    data: { frontmatter },
  } = file;

  return (
    <>
      {!getFrontmatterValue(frontmatter, "inactivateToc") && (
        <Toc
          markdown={markdown}
          maxDepth={getFrontmatterValue(frontmatter, "maxDepthOfToc")}
        />
      )}

      <Markdown
        markdown={markdown}
        imageOptimize={getFrontmatterValue(frontmatter, "imageOptimize")}
        imageInline={getFrontmatterValue(frontmatter, "imageInline")}
        imageUrlToPreviewImage={imageUrlToPreviewImage}
      />

      {!getFrontmatterValue(frontmatter, "inactivateComments") && (
        <Utterances issueNumber={number} />
      )}
    </>
  );
}

function getFrontmatterValue<
  O extends Frontmatter | undefined,
  K extends keyof Frontmatter
>(object: O, key: K): NonNullable<Frontmatter[K]> | undefined {
  if (object === undefined) {
    return;
  }

  const value = object[key];

  if (value === undefined) {
    return;
  }

  return value;
}
