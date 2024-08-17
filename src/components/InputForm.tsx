'use client';
import {
  Button,
  Card,
  Divider,
  Group,
  Loader,
  Select,
  Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { PROGRAMMING_LANGUAGES_LIST } from '../data/programmingLanguagesList';
import { TOPICS_LIST } from '../data/topicsList';
import RepositoryCard, { RepositoryCardProps } from './RepositoryCard';
import { Repository } from '../types/type';
import ShortlistedRepoCard from './ShortlistedRepoCard';

import { useRandomRepos } from '../hooks/useRandomRepo';

export type InputFormValues = {
  programmingLanguage: string;
  topics: string;
  stars: string;
};

// TODO: [Enhancement] - After clicking on + Save button display a toast notification.
// TODO: [Enhancement] - Instead of window.confirm let's use Modal component from Mantine.

function InputForm() {
  const [repositoryData, setRepositoryData] =
    useState<RepositoryCardProps | null>(null);

  const [shortlistedRepos, setShortlistedRepos] = useState<Repository[]>([]);

  // We need to put the code that runs on browser in useEffect otherwise we get Next.js hydration error.
  useEffect(() => {
    const storedRepos =
      typeof window !== 'undefined'
        ? localStorage.getItem('shortlistedRepos')
        : null;

    if (storedRepos) {
      setShortlistedRepos(JSON.parse(storedRepos));
    }
  }, []);

  // Gets called when user clicks on + Save button
  const handleStoreShortlistedRepos = (singleRepo: Repository) =>
    setShortlistedRepos((prevRepos) => {
      const updatedRepos = [...prevRepos, singleRepo];
      // Check if window is available then only try to use localStorage otherwise it gives error as "localStorage is not defined"
      if (typeof window !== 'undefined') {
        localStorage.setItem('shortlistedRepos', JSON.stringify(updatedRepos));
      }
      return updatedRepos;
    });

  function removeASingleRepoFromLocalStorage(repoURL: string) {
    if (
      window.confirm(
        `Are you sure you want to remove this repo from shortlisted repos?`
      )
    ) {
      setShortlistedRepos((prevRepos) => {
        const updatedRepos = prevRepos.filter(
          (repo) => repo.repoURL !== repoURL
        );
        localStorage.setItem('shortlistedRepos', JSON.stringify(updatedRepos));
        return updatedRepos;
      });
    }
  }

  function removeAllShortlistedRepos() {
    if (
      window.confirm(
        `Are you sure you want to remove all repos from shortlisted repos?`
      )
    ) {
      setShortlistedRepos([]);
      localStorage.removeItem('shortlistedRepos');
      window.location.reload();
    }
  }

  // Structure for the Search Form
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      programmingLanguage: '',
      topics: '',
      stars: '',
    },

    validate: {
      programmingLanguage: (value) => (value !== '' ? null : 'Input required!'),
      topics: (value) => (value !== '' ? null : 'Input required!'),
      stars: (value) => (value !== '' ? null : 'Input required!'),
    },
  });

  const formDataValues = form.getValues();

  // Consume useRandomRepos hook
  const { getNextRepo, isFetching } = useRandomRepos({
    topics: formDataValues.topics || '',
    programmingLanguage: formDataValues.programmingLanguage || '',
    stars: formDataValues.stars || '0',
  });

  const handleClickRandomRepos = () => {
    const nextRepo: Repository | null = getNextRepo();
    if (nextRepo) {
      setRepositoryData({
        ...nextRepo,
        isRateLimitingError: false,
        isNoReposFoundError: false,
        handleStoreShortlistedRepos: handleStoreShortlistedRepos,
      });
    }
  };

  return (
    <div>
      <Group mt='md' justify='center'>
        <Card
          shadow='sm'
          padding='lg'
          radius='md'
          withBorder
          style={{ width: 500 }}
        >
          <form onSubmit={form.onSubmit(handleClickRandomRepos)}>
            <Select
              required
              label='Programming Language'
              placeholder='Pick value'
              data={PROGRAMMING_LANGUAGES_LIST}
              clearable
              searchable
              key={form.key('programmingLanguage')}
              {...form.getInputProps('programmingLanguage')}
            />
            <br />

            <Select
              label='Topics'
              required
              placeholder='Pick value'
              searchable
              data={TOPICS_LIST}
              clearable
              key={form.key('topics')}
              {...form.getInputProps('topics')}
            />
            <br />
            <Select
              label='Stars'
              required
              searchable
              placeholder='Pick value'
              key={form.key('stars')}
              clearable
              data={[
                { value: '100', label: 'Min 100 stars' },
                {
                  value: '500',
                  label: 'Min 500 stars',
                },
                { value: '1000', label: 'Min 1000 stars' },
                { value: '2000', label: 'Min 2000 stars' },
                { value: '5000', label: 'Min 5000 stars' },
                { value: '10000', label: 'Min 10000 stars' },
                { value: '20000', label: 'Min 20000 stars' },
                { value: '30000', label: 'Min 30000 stars' },
                { value: '50000', label: 'Min 50000 stars' },
              ]}
              {...form.getInputProps('stars')}
            />

            <Group mt='md' justify='center'>
              <Button type='submit' disabled={isFetching}>
                {isFetching ? 'Searching...' : 'Search'}
              </Button>
            </Group>
          </form>
        </Card>
      </Group>

      {repositoryData && <RepositoryCard {...repositoryData} />}
      {shortlistedRepos.length > 0 && <Divider my='md' />}
      {/* TODO: Make these shortlisted repos content appear in separate lines */}
      <Stack justify='center'>
        {shortlistedRepos.length > 0 && (
          <>
            <Group justify='center'>
              <h3>Shortlisted Repos:</h3>
            </Group>
            <Group justify='center'>
              <Button onClick={() => removeAllShortlistedRepos()}>
                Clear from LocalStorage
              </Button>
            </Group>

            <Group justify='center'>
              {shortlistedRepos.map((repo: Repository, index) => (
                <ShortlistedRepoCard
                  repoURL={repo.repoURL}
                  name={repo.name}
                  description={repo.description}
                  stars={repo.stars}
                  topics={repo.topics}
                  key={index}
                  removeASingleRepoFromLocalStorage={
                    removeASingleRepoFromLocalStorage
                  }
                />
              ))}
            </Group>
          </>
        )}
      </Stack>
    </div>
  );
}

export default InputForm;
