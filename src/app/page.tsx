import { MarkdownContent } from "@/components/MarkdownContent";
import markdown from "@/docs/about.md";

export default function Home() {
  return (
    <main className="mt-6">
      <MarkdownContent content={markdown} />
    </main>
  );
}
