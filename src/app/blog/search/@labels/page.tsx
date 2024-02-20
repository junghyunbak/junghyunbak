import { apiService } from "@/apis";
import { LabelList } from "@/components/LabelList";

export default async function SearchLabels() {
  const labels = await apiService.getAllLabel();

  return <LabelList labels={labels} isSearch={true} />;
}
