import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: `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`,
});

type RequestData = {
  programmingLanguage: string;
  topics: string;
};
export async function POST(request: Request) {
  const requestData: RequestData = await request.json();
  const repos = await octokit.rest.search.repos({
    q: `${requestData.programmingLanguage}+topic:${requestData.topics}`,
    per_page: 1,
  });
  return Response.json({ repos });
}
