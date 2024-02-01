import { MarkdownContent } from "@/components/MarkdownContent";
import { getIssueItem } from "@/apis";

export default async function Post({ params }: { params: { post: string } }) {
  const issue = await getIssueItem(params.post);

  return (
    <div>
      <div>
        <p className="text-2xl text-center">{issue.title}</p>
      </div>

      <MarkdownContent content={issue.body || ""} />
    </div>
  );
}
