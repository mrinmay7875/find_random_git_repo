import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { InputFormValues } from '../components/InputForm';

async function fetchRepos(value: InputFormValues): Promise<any> {
  const data = await fetch('api/getRepository', {
    method: 'POST',
    body: JSON.stringify({
      programmingLanguage: value.programmingLanguage,
      topics: value.topics,
      minStars: parseInt(value.stars),
    }),
  });

  return data.json();
}

export const useRandomRepos = (inputFormValues: InputFormValues) => {
  const [repoIndex, setRepoIndex] = useState(0);

  const { data: repos, refetch } = useQuery({
    queryKey: ['repos'],
    queryFn: () => fetchRepos(inputFormValues),
  });

  // Fetches next repo from the list
  const getNextRepo = () => {
    if (!repos) return null;

    // Get the current quote
    const repo = repos[repoIndex];

    // Increment the index, and refetch if we've used all quotes
    if (repoIndex >= repos.length - 1) {
      setRepoIndex(0);
      refetch(); // Fetch new quotes after exhausting the current list
    } else {
      setRepoIndex((prevIndex) => prevIndex + 1);
    }

    return repo;
  };

  return { getNextRepo, repos };
};
