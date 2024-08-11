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
import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { PROGRAMMING_LANGUAGES_LIST } from '../data/programmingLanguagesList';
import { TOPICS_LIST } from '../data/topicsList';
import RepositoryCard, { RepositoryCardProps } from './RepositoryCard';
import { Repository } from '../types/type';
import ShortlistedRepoCard from './ShortlistedRepoCard';

type InputFormValues = {
  programmingLanguage: string;
  topics: string;
  stars: string;
};

// TODO: Change the Submit button text into Search button
// TODO: Implement feature to remove a single repository from the shortlisted list(localstorage)
// FIXME: [BUG] - Fix FavIcon not found error.
// TODO: [Enhancement] - After clicking on clearAll button refresh the screen and display a toast notification.
// TODO: [Enhancement] - After clicking on + Save button display a toast notification.
// TODO: [Enhancement] - Hide the divider at first when there are no short listed repos yet.

function InputForm() {
  const [repositoryData, setRepositoryData] =
    useState<RepositoryCardProps | null>(null);

  const [shortlistedRepos, setShortlistedRepos] = useState<Repository[]>([]);

  useEffect(() => {
    const storedRepos =
      typeof window !== 'undefined'
        ? localStorage.getItem('shortlistedRepos')
        : null;

    if (storedRepos) {
      setShortlistedRepos(JSON.parse(storedRepos));
    }
  }, []);

  const handleStoreShortlistedRepos = (singleRepo: Repository) =>
    setShortlistedRepos((prevRepos) => {
      const updatedRepos = [...prevRepos, singleRepo];
      // Check if window is available then only try to use localStorage otherwise it gives error as "localStorage is not defined"
      if (typeof window !== 'undefined') {
        localStorage.setItem('shortlistedRepos', JSON.stringify(updatedRepos));
      }
      return updatedRepos;
    });

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

  // Function that makes a API call to return random github repo and return a promise
  async function fetchRepos(value: InputFormValues): Promise<any> {
    const data = await fetch('api/getRepository', {
      method: 'POST',
      body: JSON.stringify({
        programmingLanguage: value.programmingLanguage,
        topics: value.topics,
        minStars: parseInt(value.stars),
      }),
    });
    const result = await data.json();

    // generate a random number between 0 and 100
    const randomIndex = Math.floor(Math.random() * result.length);
    if (result.length === 0) {
      let repositoryObject: RepositoryCardProps | null = {
        repoURL: 'html_url',
        name: 'name',
        description: 'description',
        stars: 0,
        topics: ['topics'],
        isRateLimitingError: false,
        isNoReposFoundError: true,
        handleStoreShortlistedRepos: handleStoreShortlistedRepos,
      };
      setRepositoryData({ ...repositoryObject });
    } else {
      let { description, html_url, name, stargazers_count, topics } =
        result[randomIndex];

      let repositoryObject: RepositoryCardProps | null = {
        repoURL: html_url,
        name: name,
        description: description,
        stars: stargazers_count,
        topics: topics,
        isRateLimitingError: false,
        isNoReposFoundError: false,
        handleStoreShortlistedRepos: handleStoreShortlistedRepos,
      };
      setRepositoryData({ ...repositoryObject });
    }
  }

  // We will use this mutation when input form is submitted
  const mutation = useMutation({
    mutationFn: fetchRepos,
    onSuccess: (data: any) => {
      console.log('Success:', data);
    },
    onError: (error, variables, context) => {
      console.log('error', { error, variables, context });
      let repositoryObject: RepositoryCardProps | null = {
        repoURL: 'html_url',
        name: 'name',
        description: 'description',
        stars: 0,
        topics: ['topics'],
        isRateLimitingError: true,
        isNoReposFoundError: false,
        handleStoreShortlistedRepos: handleStoreShortlistedRepos,
      };
      setRepositoryData(repositoryObject);
    },
  });

  // Runs when input form is submitted
  function handleFormSubmit(value: InputFormValues) {
    setRepositoryData(null);
    mutation.mutate(value);
  }
  // console.log('mutation.data', mutation.data);
  // console.log('mutation.isPending', mutation.isPending);

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
          <form onSubmit={form.onSubmit(handleFormSubmit)}>
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
              <Button type='submit' disabled={mutation.isPending}>
                {mutation.isPending ? 'Searching...' : 'Search'}
              </Button>
            </Group>
          </form>
        </Card>
      </Group>
      {mutation.isPending && (
        <Group mt='md' justify='center'>
          <Loader size={50} />
        </Group>
      )}
      {repositoryData && <RepositoryCard {...repositoryData} />}
      <Divider my='md' />
      {/* TODO: Make these shortlisted repos content appear in separate lines */}
      <Stack justify='center'>
        {shortlistedRepos.length > 0 && (
          <>
            <Group justify='center'>
              <h3>Shortlisted Repos:</h3>
            </Group>
            <Group justify='center'>
              <Button onClick={() => localStorage.clear()}>
                Clear from LocalStorage
              </Button>
            </Group>

            <Group justify='center'>
              {shortlistedRepos.map((repo: Repository, index) => (
                <ShortlistedRepoCard key={index} {...repo} />
              ))}
            </Group>
          </>
        )}
      </Stack>
    </div>
  );
}

export default InputForm;
