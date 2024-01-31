import { LabelListResponse } from "@/app/blog/_types/label";

interface LabelListItem {
  label: LabelListResponse["data"][number];
}

export function LabelListItem({ label }: LabelListItem) {
  return (
    <li className="border border-primary rounded-sm p-[0.3125rem] cursor-pointer mt-11">
      <p className="text-sm leading-4 text-primary">{`#${label.name}`}</p>
    </li>
  );
}
