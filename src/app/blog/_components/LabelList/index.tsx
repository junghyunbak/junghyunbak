import { type LabelListResponse } from "@/types/label";
import Link from "next/link";

interface LabelListProps {
  labels: LabelListResponse["data"];
  currentLabel?: string;
}

export function LabelList({ labels, currentLabel }: LabelListProps) {
  return (
    <ul className="flex flex-wrap gap-1.5 mt-11">
      {labels.map((label) => {
        const isActive = label.name === currentLabel;

        return (
          <li key={label.id}>
            <Link
              className={[
                "border border-primary rounded-sm p-[0.3125rem] text-sm leading-4",
                isActive ? "bg-primary text-white" : "text-primary",
              ].join(" ")}
              href={isActive ? `/blog` : `/blog?label=${label.name}`}
            >
              {`#${label.name}`}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}