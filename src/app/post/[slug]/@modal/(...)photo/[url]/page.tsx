import { RouteModal } from "@/components/RouteModal";

export default function PhotoModal({
  params: { url },
}: {
  params: { url: string };
}) {
  return (
    <RouteModal>
      <img src={decodeURIComponent(url)} />
    </RouteModal>
  );
}
