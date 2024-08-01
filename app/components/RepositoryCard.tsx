import { Card, Image, Text } from '@mantine/core';
import React from 'react';

export type RepositoryCardProps = {
  repoURL: string;
  name: string;
  description: string;
  stars: number;
};

function RepositoryCard({
  repoURL,
  name,
  description,
  stars,
}: RepositoryCardProps) {
  return (
    <div>
      <Card
        shadow='sm'
        padding='xl'
        component='a'
        href={repoURL}
        target='_blank'
      >
        <Card.Section>
          <Image
            src='https://images.unsplash.com/photo-1579227114347-15d08fc37cae?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2550&q=80'
            h={160}
            alt='No way!'
          />
        </Card.Section>

        <Text fw={500} size='lg' mt='md'>
          {name}
        </Text>

        <Text mt='xs' c='dimmed' size='sm'>
          {description}
        </Text>
        <Text mt='xs' c='dimmed' size='sm'>
          {stars} stars
        </Text>
      </Card>
    </div>
  );
}

export default RepositoryCard;
