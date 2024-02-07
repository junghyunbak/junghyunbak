import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkToc from "remark-toc";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import sharp from "sharp";
import Image from "next/image";
import "./MarkdownContent.css";

interface MarkdownContentProps {
  content: string;
}

/**
 * Markdown 컴포넌트 내 코드 하이라이팅을 위한 예제를 가져왔고,
 * 정상작동하지만 타입 에러가 발생해서 당장은 ignore 처리함.
 */
export async function MarkdownContent({ content }: MarkdownContentProps) {
  const markdownImageUrlPattern = /(src="|\!\[.*?\]\()(.*?)(\)|")/g;

  const imageUrls = [];

  let match: ReturnType<RegExp["exec"]> = null;

  while ((match = markdownImageUrlPattern.exec(content)) !== null) {
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
      <Markdown
        remarkPlugins={[remarkGfm, remarkToc]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{
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
        {content}
      </Markdown>
    </div>
  );
}
