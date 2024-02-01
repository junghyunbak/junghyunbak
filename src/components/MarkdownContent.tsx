import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "./MarkdownContent.css";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="markdown">
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          code({ inline, children, className, node, ...props }) {
            const match = /language-(\w+)/.exec(className || "");

            return !inline && match ? (
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
