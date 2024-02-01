import { LabelListItem } from "./LabelListItem";
import { type LabelListResponse } from "@/types/label";

interface LabelListProps {
  labels: LabelListResponse["data"];
}

export function LabelList({ labels }: LabelListProps) {
  return (
    <ul className="flex gap-1.5">
      {labels.map((label) => {
        return <LabelListItem key={label.id} label={label} />;
      })}
    </ul>
  );
}
