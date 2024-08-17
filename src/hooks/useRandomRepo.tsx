import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { InputFormValues } from '../components/InputForm';

async function fetchRepos(value: InputFormValues): Promise<any> {
  const response = await fetch('api/getRepository', {
    method: 'POST',
    body: JSON.stringify({
      programmingLanguage: value.programmingLanguage,
      topics: value.topics,
      minStars: parseInt(value.stars),
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}

export const useRandomRepos = (inputFormValues: InputFormValues) => {
  const [repoIndex, setRepoIndex] = useState(0);

  const { data: repos, refetch } = useQuery({
    queryKey: ['repos', inputFormValues],
    queryFn: () => fetchRepos(inputFormValues),
  });

  // Fetch new data if the index exceeds the length of the current repos
  useEffect(() => {
    if (repos && repoIndex >= repos.length) {
      refetch();
    }
  }, [repoIndex, repos, refetch]);

  const getNextRepo = () => {
    if (!repos) return null;

    // Get the current repo
    const repo = repos[repoIndex];

    // Increment the index or refetch if needed
    if (repoIndex >= repos.length - 1) {
      setRepoIndex(0);
      refetch();
    } else {
      setRepoIndex((prevIndex) => prevIndex + 1);
    }

    return repo;
  };

  return { getNextRepo, repos };
};
