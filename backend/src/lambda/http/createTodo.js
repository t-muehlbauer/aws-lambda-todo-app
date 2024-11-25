import 'source-map-support/register.js';
import * as middy from 'middy';
import { cors } from 'middy/middlewares.js';
import { getUserId } from '../utils.mjs';
import { createTodo } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('createTodo');

export const handler = middy(async (event) => {
  const newTodo = JSON.parse(event.body);
  
  const userId = getUserId(event);
  logger.info(`Creating a new todo for user ${userId}`);

  const todo = await createTodo(userId, newTodo);

  logger.info(`Todo created successfully for user ${userId}`);

  return {
    statusCode: 201,
    body: JSON.stringify({
      item: todo
    })
  };
});

handler.use(
  cors({
    credentials: true
  })
);