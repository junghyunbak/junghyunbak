import { ReadmeContent } from "./_components/ReadmeContent";
import { apiService } from "@/apis";
import Link from "next/link";

export default async function ReadmePage({
  params: { slug = [] },
}: {
  params: { slug: string[] };
}) {
  const [owner, repo] = slug;

  const readme = await apiService.getRepositoryReadme(owner, repo);

  return (
    <>
      <div className="mx-2 mb-8 mt-2">
        <Link
          className="underline-offset-4 hover:underline"
          href={`/portfolio`}
        >
          ← 포트폴리오 페이지 이동
        </Link>
      </div>

      <ReadmeContent readme={readme} />
    </>
  );
}
