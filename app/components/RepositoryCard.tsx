import { Anchor, Badge, Card, Group, Image, Text } from '@mantine/core';
import React from 'react';

export type RepositoryCardProps = {
  repoURL: string;
  name: string;
  description: string;
  stars: number;
  topics: string[];
};

function RepositoryCard({
  repoURL,
  name,
  description,
  stars,
  topics,
}: RepositoryCardProps) {
  return (
    <div>
      <Group mt='md' mb={15} justify='center'>
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
        </Card>
      </Group>
    </div>
  );
}

export default RepositoryCard;
