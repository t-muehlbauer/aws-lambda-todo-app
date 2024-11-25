import 'source-map-support/register.js';
import * as middy from 'middy';
import { cors } from 'middy/middlewares.js';
import { getUserId } from '../utils.mjs';
import { deleteTodo } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('deleteTodo');

export const handler = middy(async (event) => {
  const todoId = event.pathParameters.todoId;
  
  const userId = getUserId(event);
  logger.info(`Deleting todo with ID ${todoId} for user ${userId}`);

  await deleteTodo(userId, todoId);

  logger.info(`Todo with ID ${todoId} deleted successfully for user ${userId}`);

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