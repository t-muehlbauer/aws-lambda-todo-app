import 'source-map-support/register.js';
import * as middy from 'middy';
import { cors } from 'middy/middlewares.js';
import { getUserId } from '../utils.mjs';
import { getTodosForUser } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('getTodos');

export const handler = middy(async (event) => {
  const userId = getUserId(event);
  logger.info(`Fetching todos for user ${userId}`);
  const todos = await getTodosForUser(userId);

  return {
    statusCode: 200,
    body: JSON.stringify({
      items: todos
    })
  };
});

handler.use(
  cors({
    credentials: true
  })
);