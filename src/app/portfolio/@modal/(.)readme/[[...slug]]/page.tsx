import { RouteModal } from "@/components/RouteModal";
import { ReadmeViewer } from "@/app/portfolio/readme/[[...slug]]/_components/ReadmeViewer";

export default async function ReadmeModal({
  params: { slug = [] },
}: {
  params: { slug: string[] };
}) {
  const [owner, repo] = slug;

  return (
    <RouteModal>
      <ReadmeViewer owner={owner} repo={repo} />
    </RouteModal>
  );
}
