import React from "react";

interface ReadmeHeaderProps {
  owner: string;
  repo: string;
}

export function ReadmeHeader({ owner, repo }: ReadmeHeaderProps) {
  return (
    <div className="border-b border-gray-300 p-4">
      <p className="[&_a]:text-clickable">
        <a href={`https://github.com/${owner}`} target="_blank">
          {owner}
        </a>
        {" / "}
        <a href={`https://github.com/${owner}/${repo}`} target="_blank">
          {repo}
        </a>
        {" - README.md"}
      </p>
    </div>
  );
}
