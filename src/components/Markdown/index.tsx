import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import sharp from "sharp";
import Image from "next/image";
import Link from "next/link";

type PreviewImageData = {
  width: number;
  height: number;
  base64: `data:image/jpeg;base64,${string}`;
};

interface MarkdownProps {
  markdown: string;
  imageOptimize?: boolean;
}

export async function Markdown({
  markdown,
  imageOptimize = true,
}: MarkdownProps) {
  const urls = extractUrlsFromMarkdown(markdown);

  const imageUrlToPreviewImage = imageOptimize
    ? await getImageUrlToPreviewImageData(urls)
    : new Map();

  return (
    <CustomReactMarkdown
      markdown={markdown}
      imageUrlToPreviewImage={imageUrlToPreviewImage}
    />
  );
}

interface CustomReactMarkdownProps {
  markdown: string;
  imageUrlToPreviewImage: Map<string, PreviewImageData>;
}

export function CustomReactMarkdown({
  markdown,
  imageUrlToPreviewImage,
}: CustomReactMarkdownProps) {
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, [remarkFrontmatter, ["toml"]]]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
          code(test) {
            const { children, className } = test;

            let match: ReturnType<RegExp["exec"]>;

            if (!className || !(match = /language-(\w+)/.exec(className))) {
              return <code>{children}</code>;
            }

            return (
              <SyntaxHighlighter
                PreTag="div"
                language={match[1]}
                style={vscDarkPlus}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            );
          },
          img({ src, alt = "" }) {
            let previewImageData: PreviewImageData | undefined;

            if (!src || !(previewImageData = imageUrlToPreviewImage.get(src))) {
              return <img src={src} alt={alt} />;
            }

            const { width, height, base64 } = previewImageData;

            return (
              <Image
                src={src}
                width={width}
                height={height}
                alt={alt}
                placeholder="blur"
                blurDataURL={base64}
              />
            );
          },
          a({ href, children, node, ref, ...props }) {
            if (!href) {
              return null;
            }

            if (href.startsWith("http")) {
              return (
                <a href={href} target="_blank" {...props}>
                  {children}
                </a>
              );
            }

            return (
              <Link href={href} {...props} scroll={false}>
                {children}
              </Link>
            );
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}

export function extractUrlsFromMarkdown(markdown: string) {
  const urls = [];

  const markdownImageUrlPattern = /(src="|\!\[.*?\]\()(.*?)(\)|")/g;

  let match: ReturnType<RegExp["exec"]> = null;

  while ((match = markdownImageUrlPattern.exec(markdown)) !== null) {
    urls.push(match[2]);
  }

  return urls;
}

export async function getImageUrlToPreviewImageData(
  urls: string[]
): Promise<Map<string, PreviewImageData>> {
  const imageUrlToPreviewImage = new Map<string, PreviewImageData>();

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        cache: "force-cache",
      });

      const arrayBuffer = await response.arrayBuffer();

      /**
       * 테스트 환경에서 `jest-fetch-mock`을 사용하였을 때,
       * ArrayBuffer 객체가 올바르게 인식되지 않는 문제가 있어
       * Buffer로 한번 더 변경해주었다.
       */
      const image = sharp(Buffer.from(arrayBuffer));

      const previewImage = await image
        .toFormat("jpeg")
        .jpeg({ quality: 1 })
        .toBuffer({ resolveWithObject: true });

      const base64 = previewImage.data.toString("base64");

      imageUrlToPreviewImage.set(url, {
        width: previewImage.info.width,
        height: previewImage.info.height,
        base64: `data:image/jpeg;base64,${base64}`,
      });
    } catch (e) {
      /**
       * 예러가 발생하는 경우
       *
       * 예 - iframe의 src를 가져오는 경우
       */
    }
  }

  return imageUrlToPreviewImage;
}
