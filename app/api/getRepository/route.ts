import { Octokit } from '@octokit/rest';

// TODO: Make sure to move the PAT into .env file
const octokit = new Octokit({
  auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
});

type RequestData = {
  programmingLanguage: string;
  topics: string;
};
export async function POST(request: Request) {
  const requestData: RequestData = await request.json();
  const repos = await octokit.rest.search.repos({
    q: `${requestData.programmingLanguage}+topic:${requestData.topics}`,
    per_page: 100,
    page: 1,
  });
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
