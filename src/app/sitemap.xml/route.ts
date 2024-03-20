import { apiService } from "@/apis";
import { GITHUB } from "@/constants";

export const dynamic = "force-dynamic";

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

export async function GET() {
  /**
   * nginx reverse proxy로 인해 origin이 localhost로 찍히는 이슈가 있어 도메인을 하드코딩함.
   */
  const origin = "https://lightpavilion.site";

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
    ...GITHUB.ISSUE_REQUEST_DEFAULT_OPTIONS,
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
      ...GITHUB.ISSUE_REQUEST_DEFAULT_OPTIONS,
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
    creator: GITHUB.REPO_OWNER,
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

  /**
   * all issue's comments
   */
  const commentSitemaps: string[] = [];

  const issueComments = await apiService.getAllIssueComment();

  issueComments.forEach((issueComment) => {
    if (issueComment.user?.login !== GITHUB.REPO_OWNER) {
      return;
    }

    commentSitemaps.push(
      createUrlInfomation({
        location: `${origin}/post/comment/${issueComment.id}`,
        changeFrequency: "weekly",
        lastModify: new Date(issueComment.updated_at),
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
      ${commentSitemaps.join("\n")}
    </urlset>
  `,
    {
      headers: {
        "Content-Type": "text/xml",
      },
    }
  );
}
