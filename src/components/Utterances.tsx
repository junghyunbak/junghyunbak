"use client";

interface UtterancesProps {
  issueNumber: number;
}

export function Utterances({ issueNumber }: UtterancesProps) {
  return (
    <div
      ref={(el) => {
        if (!el) {
          return;
        }

        const script = document.createElement("script");

        script.src = "https://utteranc.es/client.js";
        script.async = true;

        /**
         * HTMLScriptElement에 없는 속성들의 정의
         */
        script.setAttribute("repo", "junghyunbak/junghyunbak");
        script.setAttribute("issue-number", issueNumber.toString());
        script.setAttribute("theme", "github-light");
        script.setAttribute("crossorigin", "anonymous");

        el.innerHTML = "";

        el.appendChild(script);
      }}
    />
  );
}
