import 'source-map-support/register';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getUserId } from '../utils';
import { updateTodo } from '../../businessLogic/todos';
import { createLogger } from '../utils/logger';

const logger = createLogger('updateTodo');

export const handler = middy(async (event) => {
  const todoId = event.pathParameters.todoId;
  const updatedTodo = JSON.parse(event.body);
  
  const userId = getUserId(event);
  logger.info(`Updating todo with ID ${todoId} for user ${userId}`);

  await updateTodo(userId, todoId, updatedTodo);

  logger.info(`Todo with ID ${todoId} updated successfully for user ${userId}`);

  return {
    statusCode: 204,
    body: ''
  };
});

handler.use(
  cors({
    credentials: true
  })
);