import { type LabelListResponse } from "@/types/label";
import Link from "next/link";

interface LabelListProps {
  labels: LabelListResponse["data"];
}

export function LabelList({ labels }: LabelListProps) {
  return (
    <ul className="flex flex-wrap gap-1.5 mt-11">
      {labels.map((label) => {
        return (
          <li key={label.id}>
            <Link
              className="border border-primary rounded-sm p-[0.3125rem] text-sm leading-4 text-primary"
              href={`/blog?label=${label.name}`}
            >
              {`#${label.name}`}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
