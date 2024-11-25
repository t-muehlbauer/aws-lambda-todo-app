import 'source-map-support/register.js';
import * as middy from 'middy';
import { cors } from 'middy/middlewares.js';
import { getUserId } from '../utils.mjs';
import { updateTodo } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';

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