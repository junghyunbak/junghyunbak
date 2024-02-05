import { revalidateTag } from "next/cache";
import { type NextRequest } from "next/server";
import type { IssuesEvent, LabelEvent } from "@octokit/webhooks-types";

export async function POST(request: NextRequest) {
  switch (request.headers.get("x-github-event")) {
    case "issues": {
      const payload = (await request.json()) as IssuesEvent;

      switch (payload.action) {
        case "opened":
        case "deleted":
          revalidateTag("allIssue");

        case "labeled":
        case "unlabeled":
          revalidateTag("issues");
          revalidateTag("issuesPageCount");

        case "edited":
          revalidateTag(payload.issue.number.toString());

          break;

        default:
          break;
      }

      break;
    }

    case "label": {
      const payload = (await request.json()) as LabelEvent;

      switch (payload.action) {
        case "deleted":
        case "edited":
          revalidateTag("issue");

          revalidateTag("issues");
          revalidateTag("issuesPageCount");

        case "created":
          revalidateTag("allLabel");
          revalidateTag("labelsPageCount");

          break;

        default:
          break;
      }
    }

    default:
      break;
  }

  return Response.json({ message: "this is revalidate route" });
}
