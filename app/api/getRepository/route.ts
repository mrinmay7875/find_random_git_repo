import { Octokit } from '@octokit/rest';
import { NUMBER_OF_REPOSITORIES_PER_PAGE_FROM_API } from '../../../src/const/const';

const octokit = new Octokit({
  auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
});

type RequestData = {
  programmingLanguage: string;
  topics: string;
  minStars: number;
};
export async function POST(request: Request) {
  const requestData: RequestData = await request.json();
  const repos = await octokit.rest.search.repos({
    q: `${requestData.programmingLanguage}+topic:${requestData.topics}+stars:>=${requestData.minStars}`,
    per_page: NUMBER_OF_REPOSITORIES_PER_PAGE_FROM_API,
    page: 1,
  });
  console.log('repos', repos);
  // TODO: Add error handling here.
  return Response.json(repos.data.items);
}

/*
Different properties we are picking
forks_count --> Forks count
full_name --> Repository name
open_issues_count --> Open issues count
stargazers_count --> Stars count
watchers_count -->  Watchers count
topics: string[] --> list of topics
owner: {avatar_url, login, html_url} --> Repo owner
*/
