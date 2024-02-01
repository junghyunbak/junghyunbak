import { LabelListResponse } from "@/types/label";
import Link from "next/link";

interface LabelListItem {
  label: LabelListResponse["data"][number];
}

export function LabelListItem({ label }: LabelListItem) {
  return (
    <Link
      className="border border-primary rounded-sm p-[0.3125rem] text-sm leading-4 text-primary"
      href={`/blog/${label.name}`}
    >
      {`#${label.name}`}
    </Link>
  );
}
