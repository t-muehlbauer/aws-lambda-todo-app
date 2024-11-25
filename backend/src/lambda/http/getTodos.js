import 'source-map-support/register.js';
import { getUserId } from '../utils.mjs';
import { getTodosForUser } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('getTodos');

const getTodos = async (event) => {
  const userId = getUserId(event);
  logger.info(`Fetching todos for user ${userId}`);
  const todos = await getTodosForUser(userId);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,OPTIONS'
    },
    body: JSON.stringify({
      items: todos
    })
  };
};

export const handler = getTodos;