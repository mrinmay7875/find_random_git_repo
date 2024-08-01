'use client';
import { Button, Card, Group, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useMutation, useQuery } from '@tanstack/react-query';
// import { useState } from 'react';

type InputFormValues = {
  programmingLanguage: string;
  topics: string;
  stars: string;
};

function InputForm() {
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
  async function fetchRepos(): Promise<any> {
    const data = await fetch('https://dummyjson.com/quotes/random');
    return data.json();
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
    mutation.mutate();
  }
  // console.log('mutation.data', mutation.data);
  // console.log('mutation.isPending', mutation.isPending);

  return (
    <Card shadow='sm' padding='lg' radius='md' withBorder>
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        <Select
          required
          label='Programming Language'
          placeholder='Pick value'
          data={['JavScript', 'TypeScript', 'Python']}
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
          data={['React', 'Angular', 'Vue', 'Next.js', 'Svelte', 'Gatsby']}
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
          <Button type='submit'>Submit</Button>
        </Group>
      </form>
    </Card>
  );
}

export default InputForm;
