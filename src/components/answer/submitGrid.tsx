import type { FC } from 'react';
import type { Answer } from '@prisma/client';
import { Grid, GridItem, Button } from '@chakra-ui/react';

import useAuthError from '../../hooks/useAuthError';
import { trpc } from '../../utils/trpc';

interface Props {
  code: string;
  answers: Pick<Answer, 'id' | 'content'>[];
}

const SubmitGrid: FC<Props> = ({ answers, code }) => {
  const onError = useAuthError();
  const submitAnswer = trpc.useMutation('answer.submit');

  const handleSubmit = async (id: number): Promise<void> => {
    try {
      await submitAnswer.mutateAsync({ code, answerId: id });
    } catch (error) {
      onError(error as Parameters<typeof onError>[0]);
    }
  };

  const getColumnsCount = (): number => {
    if (answers.length <= 1) return 1;
    if (answers.length <= 4) return 2;
    return 3;
  };

  const rowsCount = Math.ceil(answers.length / getColumnsCount());

  return (
    <Grid
      gap={6}
      templateColumns={`repeat(${getColumnsCount()}, 1fr)`}
      templateRows={`repeat(${rowsCount}, 1fr)`}
      height="100%"
    >
      {answers.map(({ id, content }) => (
        <GridItem key={id} width="100%" height="100%">
          <Button
            width="100%"
            height="100%"
            colorScheme="gray"
            onClick={() => handleSubmit(id)}
          >
            {content}
          </Button>
        </GridItem>
      ))}
    </Grid>
  );
};

export default SubmitGrid;
