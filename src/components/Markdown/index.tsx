import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import sharp from "sharp";
import Image from "next/image";
import "./index.css";

interface MarkdownProps {
  markdown: string;
}

export async function Markdown({ markdown }: MarkdownProps) {
  const markdownImageUrlPattern = /(src="|\!\[.*?\]\()(.*?)(\)|")/g;

  const imageUrls = [];

  let match: ReturnType<RegExp["exec"]> = null;

  while ((match = markdownImageUrlPattern.exec(markdown)) !== null) {
    imageUrls.push(match[2]);
  }

  const imageUrlToPreviewImage = new Map<
    string,
    {
      width: number;
      height: number;
      base64: `data:image/jpeg;base64,${string}`;
    }
  >();

  for (const imageUrl of imageUrls) {
    try {
      const response = await fetch(imageUrl, {
        cache: "force-cache",
      });

      const image = sharp(await response.arrayBuffer());

      const previewImage = await image
        .toFormat("jpeg")
        .jpeg({ quality: 1 })
        .toBuffer({ resolveWithObject: true });

      const base64 = previewImage.data.toString("base64");

      imageUrlToPreviewImage.set(imageUrl, {
        width: previewImage.info.width,
        height: previewImage.info.height,
        base64: `data:image/jpeg;base64,${base64}`,
      });
    } catch (e) {
      /**
       * 이미지 처리와 관련한 오류 발생
       *
       * 예 - iframe의 src를 가져오는 경우
       */
      console.error(e);
    }
  }

  return (
    <div className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, [remarkFrontmatter, ["toml"]]]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
          /**
           * Markdown 컴포넌트 내 코드 하이라이팅을 위한 예제를 가져왔고,
           * 정상작동하지만 타입 에러가 발생해서 당장은 ignore 처리함.
           */

          // @ts-ignore
          code({ inline, children, className, node, ...props }) {
            const match = /language-(\w+)/.exec(className || "");

            return !inline && match ? (
              // @ts-ignore
              <SyntaxHighlighter
                {...props}
                PreTag="div"
                language={match[1]}
                style={vscDarkPlus}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code {...props} className={className}>
                {children}
              </code>
            );
          },
          img({ src = "", alt = "" }) {
            const previewImageData = imageUrlToPreviewImage.get(src);

            if (!previewImageData) {
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
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}