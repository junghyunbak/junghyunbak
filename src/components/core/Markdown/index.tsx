import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkFrontmatter from "remark-frontmatter";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeKatex from "rehype-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface MarkdownProps {
  markdown: string;

  imageOptimize?: boolean;

  imageInline?: boolean;

  imageUrlToPreviewImage?: Map<string, PreviewImage>;
}

export function Markdown({
  markdown,
  imageOptimize = true,
  imageInline = false,
  imageUrlToPreviewImage = new Map(),
}: MarkdownProps) {
  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, [remarkFrontmatter, ["toml"]]]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSlug,
          [rehypeKatex, { output: "mathml" }],
        ]}
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
            let previewImage: PreviewImage | undefined;

            if (
              !src ||
              !imageOptimize ||
              !(previewImage = imageUrlToPreviewImage.get(src))
            ) {
              return (
                /**
                 * 로컬 리소스가 아닌 이미지이기 때문에 next/image 사용불가
                 */
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt={alt}
                  style={imageInline ? { display: "inline" } : undefined}
                />
              );
            }

            const { width, height, base64 } = previewImage;

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

            if (href.startsWith("#")) {
              return (
                <a href={href} {...props}>
                  {children}
                </a>
              );
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
