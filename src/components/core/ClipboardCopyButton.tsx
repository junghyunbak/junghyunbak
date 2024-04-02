"use client";

import { CopyToClipboard } from "react-copy-to-clipboard";
import Copy from "@/assets/svgs/copy.svg";
import Check from "@/assets/svgs/check.svg";
import { useEffect, useState } from "react";

interface ClipboardCopyButtonProps {
  text: string;
}

export function ClipboardCopyButton({ text }: ClipboardCopyButtonProps) {
  const [isCopy, setIsCopy] = useState(false);

  useEffect(() => {
    if (!isCopy) {
      return;
    }

    setTimeout(() => {
      setIsCopy(false);
    }, 2000);
  }, [isCopy]);

  return (
    <div className="absolute right-0 top-0 m-2">
      <CopyToClipboard text={text} onCopy={() => setIsCopy(true)}>
        <button className="p-2">
          {!isCopy ? <Copy fill="white" /> : <Check fill="white" />}
        </button>
      </CopyToClipboard>
    </div>
  );
}
