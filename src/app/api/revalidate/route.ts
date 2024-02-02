import { revalidateTag } from "next/cache";
import { type NextRequest } from "next/server";
import _ from "lodash";

export async function POST(request: NextRequest) {
  switch (request.headers.get("x-github-event")) {
    case "issues":
    case "issue_comment":
      const payload = await request.json();

      const issueNumber = _.get(payload, "issue.number", null);

      if (typeof issueNumber === "number") {
        revalidateTag(issueNumber.toString());
      }

      break;

    default:
      break;
  }

  return Response.json({ message: "this is revalidate route" });
}
