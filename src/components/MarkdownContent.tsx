import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./MarkdownContent.css";

interface MarkdownContentProps {
  content: string;
}

/**
 * Markdown 컴포넌트 내 코드 하이라이팅을 위한 예제를 가져왔고,
 * 정상작동하지만 타입 에러가 발생해서 당장은 ignore 처리함.
 */
export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="markdown">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
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
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
