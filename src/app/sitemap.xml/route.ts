import { NextRequest } from "next/server";
import { apiService } from "@/apis";
import { ISSUE_PER_PAGE, REPO_OWNER } from "@/constants";
import type { IssuesRequestParameters } from "@/types/githubApi";

export const dynamic = "force-dynamic";

const issuesRequestDefaultOptions: IssuesRequestParameters = {
  per_page: ISSUE_PER_PAGE,
  creator: REPO_OWNER,
  assignee: "none",
};

const createUrlInfomation = ({
  location,
  lastModify,
  changeFrequency,
  priority,
}: {
  location: string;
  lastModify?: Date;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
}) => {
  const attributes = [`<loc>${location}</loc>`];

  if (lastModify) {
    attributes.push(
      `<lastmod>${lastModify.getFullYear()}-${(lastModify.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${lastModify
        .getDate()
        .toString()
        .padStart(2, "0")}</lastmod>`
    );
  }

  if (changeFrequency) {
    attributes.push(`<changefreq>${changeFrequency}</changefreq>`);
  }

  if (priority) {
    attributes.push(`<priority>${priority}</priority>`);
  }

  return `
    <url>
      ${attributes.join("\n")}
    </url>
  `;
};

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;

  const aboutSitemap = createUrlInfomation({
    location: origin,
    changeFrequency: "monthly",
    priority: 0.7,
  });

  const portfolioSitemap = createUrlInfomation({
    location: `${origin}/portfolio`,
    changeFrequency: "monthly",
    priority: 0.7,
  });

  /**
   * blog sitemap
   */
  const blogSitemaps: string[] = [];

  const pageCount = await apiService.getIssuesPageCount({
    ...issuesRequestDefaultOptions,
  });

  blogSitemaps.push(
    ...Array(pageCount)
      .fill(null)
      .map((_, i) =>
        createUrlInfomation({
          location: `${origin}/${i + 1}`,
          changeFrequency: "daily",
          priority: 0.3,
        })
      )
  );

  const labels = await apiService.getAllLabel();

  for (const label of labels) {
    const pageCount = await apiService.getIssuesPageCount({
      labels: label.name,
      ...issuesRequestDefaultOptions,
    });

    blogSitemaps.push(
      ...Array(pageCount)
        .fill(null)
        .map((_, i) =>
          createUrlInfomation({
            location: `${origin}/${i + 1}/${label.name}`,
            changeFrequency: "daily",
            priority: 0.3,
          })
        )
    );
  }

  /**
   * post sitemap
   */
  const postSitemaps: string[] = [];

  const issues = await apiService.getAllIssue({
    creator: REPO_OWNER,
    assignee: "none",
  });

  issues.forEach((issue) => {
    postSitemaps.push(
      createUrlInfomation({
        location: `${origin}/post/${issue.number}`,
        changeFrequency: "weekly",
        lastModify: new Date(issue.updated_at),
        priority: 1.0,
      })
    );
  });

  return new Response(
    `
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${aboutSitemap}
      ${portfolioSitemap}
      ${blogSitemaps.join("\n")}
      ${postSitemaps.join("\n")}
    </urlset>
  `,
    {
      headers: {
        "Content-Type": "text/xml",
      },
    }
  );
}
