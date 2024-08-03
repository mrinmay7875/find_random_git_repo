'use client';
import { Button, Card, Group, Loader, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import RepositoryCard, { RepositoryCardProps } from './RepositoryCard';
import { PROGRAMMING_LANGUAGES_LIST } from '../data/programmingLanguagesList';
import { TOPICS_LIST } from '../data/topicsList';

type InputFormValues = {
  programmingLanguage: string;
  topics: string;
  stars: string;
};

// TODO: Need to add filter by Stars as well

function InputForm() {
  const [repositoryData, setRepositoryData] =
    useState<RepositoryCardProps | null>(null);

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
      }),
    });
    const result = await data.json();

    // generate a random number between 0 and 100
    const randomIndex = Math.floor(Math.random() * 99);
    let { description, html_url, name, stargazers_count, topics } =
      result[randomIndex];

    let tempObject: RepositoryCardProps | null = {
      repoURL: html_url,
      name: name,
      description: description,
      stars: stargazers_count,
      topics: topics,
    };
    setRepositoryData({ ...tempObject });
  }

  // We will use this mutation when input form is submitted
  const mutation = useMutation({
    mutationFn: fetchRepos,
    onSuccess: (data: any) => {
      console.log('Success:', data);
    },
    onError: (error: any) => {
      console.log('error', error);
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
                '0-500 stars',
                '500-1000 stars',
                '1000-5000 stars',
                'More than 5000 stars',
              ]}
              {...form.getInputProps('stars')}
            />

            <Group mt='md' justify='center'>
              <Button type='submit' disabled={mutation.isPending}>
                {mutation.isPending ? 'Searching...' : 'Submit'}
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
    </div>
  );
}

export default InputForm;
