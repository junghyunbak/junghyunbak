import { LabelList } from "./_components/LabelList";
import { getLabels } from "@/apis";

export default async function Labels({
  searchParams,
}: {
  searchParams: { label?: string };
}) {
  const labels = await getLabels();

  return (
    <div>
      <LabelList labels={labels} currentLabel={searchParams.label} />
    </div>
  );
}
