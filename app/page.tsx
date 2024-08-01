import { Group } from '@mantine/core';
import InputForm from './components/InputForm';

export default function HomePage() {
  return (
    <div>
      <Group mt='md' justify='center'>
        <h1>Random Git repo Finder</h1>
      </Group>
      <InputForm />
    </div>
  );
}
