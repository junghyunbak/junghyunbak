import Link, { type LinkProps } from "next/link";
import Magnifier from "@/assets/svgs/magnifier.svg";
import React from "react";

interface LabelListProps {
  labels: LabelsResponseData;
  currentLabel?: string;
  isSearch?: boolean;
}

export function LabelList({
  labels,
  currentLabel,
  isSearch = false,
}: LabelListProps) {
  return (
    <ul className="mt-11 flex flex-wrap gap-1.5">
      <LabelListItem isSquare={true}>
        <LabelListItemLink
          isActive={isSearch}
          href={isSearch ? "/blog" : "/blog/search"}
        >
          <LabelListItemMagnifierContent isActive={isSearch} />
        </LabelListItemLink>
      </LabelListItem>

      {labels.map((label) => {
        const isActive = label.name === currentLabel;

        return (
          <LabelListItem key={label.id}>
            <LabelListItemLink
              isActive={isActive}
              href={isActive ? `/blog` : `/blog/1/${label.name}`}
            >
              <LabelListItemTextContent isActive={isActive} text={label.name} />
            </LabelListItemLink>
          </LabelListItem>
        );
      })}
    </ul>
  );
}

interface LabelListItemProps {
  children: React.ReactNode;
  isSquare?: boolean;
}

function LabelListItem({ children, isSquare = false }: LabelListItemProps) {
  return (
    <li className={["h-7", isSquare ? "aspect-square" : ""].join(" ")}>
      {children}
    </li>
  );
}

interface LabelListItemLinkProps extends LinkProps {
  children: React.ReactNode;
  isActive: boolean;
}

function LabelListItemLink({
  children,
  isActive,
  ...props
}: LabelListItemLinkProps) {
  return (
    <Link
      className={[
        "flex size-full items-center justify-center rounded-sm border border-primary",
        isActive ? "bg-primary" : "",
      ].join(" ")}
      {...props}
    >
      {children}
    </Link>
  );
}

interface LabelListItemTextContentProps {
  text: string;
  isActive: boolean;
}

function LabelListItemTextContent({
  text,
  isActive,
}: LabelListItemTextContentProps) {
  return (
    <p
      className={[
        "mx-[0.3125rem] text-sm",
        isActive ? "text-white" : "text-primary",
      ].join(" ")}
    >{`#${text}`}</p>
  );
}

interface LabelListItemMagnifierContentProps {
  isActive: boolean;
}

function LabelListItemMagnifierContent({
  isActive,
}: LabelListItemMagnifierContentProps) {
  return (
    <Magnifier
      className={isActive ? "[&_path]:fill-white" : "[&_path]:fill-primary"}
    />
  );
}
