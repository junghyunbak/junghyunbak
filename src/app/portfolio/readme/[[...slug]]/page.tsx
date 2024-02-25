import { ReadmeViewer } from "./_components/ReadmeViewer";

export default function ReadmePage({
  params: { slug = [] },
}: {
  params: { slug: string[] };
}) {
  const [owner, repo] = slug;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <ReadmeViewer owner={owner} repo={repo} />
    </div>
  );
}
