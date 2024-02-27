import { RouteModal } from "@/components/RouteModal";
import { ReadmeHeader } from "@/app/portfolio/readme/[[...slug]]/_components/ReadmeHeader";
import { ReadmeContent } from "@/app/portfolio/readme/[[...slug]]/_components/ReadmeContent";
import { apiService } from "@/apis";
import { ModalLayout } from "@/components/layouts/ModalLayout";
import { ScrollYWithPaddingLayout } from "@/components/layouts/ScrollYWithPaddingLayout";

export default async function ReadmeModal({
  params: { slug = [] },
}: {
  params: { slug: string[] };
}) {
  const [owner, repo] = slug;

  const readme = await apiService.getRepositoryReadme(owner, repo);

  return (
    <RouteModal>
      <ModalLayout>
        <ReadmeHeader owner={owner} repo={repo} />
        <ScrollYWithPaddingLayout>
          <ReadmeContent readme={readme} />
        </ScrollYWithPaddingLayout>
      </ModalLayout>
    </RouteModal>
  );
}
