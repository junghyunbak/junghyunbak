import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Image from "next/image";
import Link from "next/link";

interface MarkdownProps {
  markdown: string;
  imageOptimize?: boolean;
  imageUrlToPreviewImage?: Map<string, PreviewImage>;
}

export function Markdown({
  markdown,
  imageOptimize = true,
  imageUrlToPreviewImage = new Map(),
}: MarkdownProps) {
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
            let previewImage: PreviewImage | undefined;

            if (
              !src ||
              !imageOptimize ||
              !(previewImage = imageUrlToPreviewImage.get(src))
            ) {
              return <img src={src} alt={alt} />;
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
