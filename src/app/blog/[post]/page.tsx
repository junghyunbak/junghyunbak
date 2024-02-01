import { MarkdownContent } from "@/components/MarkdownContent";
import { getIssueItem } from "@/apis";
import Link from "next/link";

export default async function Post({ params }: { params: { post: string } }) {
  const issue = await getIssueItem(params.post);

  if (!issue) {
    return <div>존재하지 않는 페이지입니다.</div>;
  }

  return (
    <div>
      <div className="flex flex-col items-center mt-16 mb-7 [&>*]:pb-3.5 border-b border-dashed border-gray-800">
        <p className="text-2xl font-semibold text-center">{issue.title}</p>

        <p className="text-g600">
          {new Date(issue.created_at).toLocaleString()}
        </p>

        <ul className="flex flex-wrap gap-2.5">
          {issue.labels.map((label, i) => {
            const id = typeof label === "string" ? i : label.id;
            const name = typeof label === "string" ? label : label.name;

            return (
              <li key={id}>
                <Link
                  href={`/blog?label=${name}`}
                  className="font-semibold text-g700"
                >
                  {`#${name}`}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <MarkdownContent content={issue.body || ""} />
    </div>
  );
}
