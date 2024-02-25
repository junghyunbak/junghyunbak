import { Markdown } from "@/components/Markdown";
import { Toc } from "@/components/Toc";
import { Utterances } from "@/components/Utterances";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkFrontmatter from "remark-frontmatter";
import remarkExtractFrontmatter from "remark-extract-frontmatter";
import remarkStringify from "remark-stringify";
const toml = require("toml").parse;

export type Frontmatter = {
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

  let {
    data: { frontmatter },
  } = file;

  if (frontmatter && !validateFrontmatterObject(frontmatter)) {
    return <p>올바르지 않은 frontmatter를 입력하였습니다.</p>;
  }

  if (!frontmatter) {
    frontmatter = {
      inactivateToc: false,
      inactivateComments: false,
      imageOptimize: true,
      imageInline: false,
      maxDepthOfToc: 3,
    };
  }

  return (
    <>
      {!frontmatter.inactivateToc && (
        <Toc markdown={markdown} maxDepth={frontmatter.maxDepthOfToc} />
      )}

      <Markdown
        markdown={markdown}
        imageOptimize={frontmatter.imageOptimize}
        imageInline={frontmatter.imageInline}
        imageUrlToPreviewImage={imageUrlToPreviewImage}
      />

      {!frontmatter.inactivateComments && <Utterances issueNumber={number} />}
    </>
  );
}

function validateFrontmatterObject(obj: object): boolean {
  const validObjectKeyCount = Object.entries(obj).reduce((a, c) => {
    const [key, value] = c;

    switch (key as keyof Frontmatter) {
      case "imageInline":
      case "imageOptimize":
      case "inactivateComments":
      case "inactivateToc":
        return a + (typeof value === "boolean" ? 1 : 0);

      case "maxDepthOfToc":
        return a + (typeof value === "number" ? 1 : 0);

      default:
        return a;
    }
  }, 0);

  const totalObjectKeyCount = Object.keys(obj).length;

  return validObjectKeyCount === totalObjectKeyCount;
}
