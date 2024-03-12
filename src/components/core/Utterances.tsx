"use client";

interface UtterancesProps {
  issueNumber?: number;
}

export function Utterances({ issueNumber = -1 }: UtterancesProps) {
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
        script.setAttribute("theme", "github-light");
        script.setAttribute("crossorigin", "anonymous");

        if (issueNumber === -1) {
          script.setAttribute("issue-term", "pathname");
        } else {
          script.setAttribute("issue-number", issueNumber.toString());
        }

        el.innerHTML = "";

        el.appendChild(script);
      }}
    />
  );
}
