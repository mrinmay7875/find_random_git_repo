import React, { useState } from 'react';
import { Anchor, Badge, Card, Group, Text, Alert, Button } from '@mantine/core';

import { IconInfoCircle } from '@tabler/icons-react';
import { Repository } from '../types/type';

export type RepositoryCardProps = {
  repoURL: string;
  name: string;
  description: string;
  stars: number;
  topics: string[];
  isRateLimitingError: boolean;
  isNoReposFoundError: boolean;
  handleStoreShortlistedRepos: (repo: Repository) => void;
};

function RepositoryCard({
  repoURL,
  name,
  description,
  stars,
  topics,
  isRateLimitingError,
  isNoReposFoundError,
  handleStoreShortlistedRepos,
}: RepositoryCardProps) {
  const icon = <IconInfoCircle />;

  const [isAlertOpen, setIsAlertOpen] = useState(isRateLimitingError);

  // Hides the Error Alert component
  function handleCloseAlert() {
    setIsAlertOpen(false);
  }

  // Adds a repo to shortList repos
  function addRepositoryToShortlist() {
    let currentRepository: Repository = {
      repoURL,
      name,
      description,
      stars,
      topics,
    };

    const storedRepos =
      typeof window !== 'undefined'
        ? localStorage.getItem('shortlistedRepos')
        : null;

    let storedReposArray: Repository[] = storedRepos
      ? JSON.parse(storedRepos)
      : [];

    // Check if repo is already added
    let foundRepo = storedReposArray.find((repo) => repo.repoURL === repoURL);

    // If repo is already added then no need to add it again
    if (foundRepo) {
      return;
    }

    // Otherwise add the repo to LocalStorage
    handleStoreShortlistedRepos(currentRepository);
  }

  if (isNoReposFoundError) {
    return (
      <Group mt='md' mb={15} justify='center'>
        <Alert
          variant='outline'
          color='red'
          withCloseButton
          title='Error'
          icon={icon}
          onClose={handleCloseAlert}
        >
          No repositories found. Please try some another combination.
        </Alert>
      </Group>
    );
  }

  if (isRateLimitingError && isAlertOpen) {
    return (
      <Group mt='md' mb={15} justify='center'>
        <Alert
          variant='outline'
          color='red'
          withCloseButton
          title='Error'
          icon={icon}
          onClose={handleCloseAlert}
        >
          You made too many requests. Please wait for around 15 seconds and try
          again.
        </Alert>
      </Group>
    );
  }

  if (!isRateLimitingError && !isAlertOpen) {
    return (
      <div>
        <Group mt='md' mb={25} justify='center'>
          <Card
            shadow='sm'
            padding='xl'
            component='div'
            style={{ width: 500 }}
            withBorder
          >
            <Anchor href={repoURL} target='_blank'>
              {name}
            </Anchor>
            <Text mt='xs' c='dimmed' size='sm' component='div'>
              <strong>Description:</strong>
              {description}
            </Text>
            <Text mt='xs' size='sm' component='div'>
              <strong>⭐️ Stars:</strong>
              <Text c='dimmed' size='lg' component='div'>
                {stars}
              </Text>
            </Text>
            <div>
              {topics.map((topic, index) => (
                <Badge key={index} color='blue' mr={10}>
                  {topic}
                </Badge>
              ))}
            </div>
            <Group mt='md' justify='center'>
              <Button onClick={addRepositoryToShortlist}> + Save</Button>
            </Group>
          </Card>
        </Group>
      </div>
    );
  }
}

export default RepositoryCard;
