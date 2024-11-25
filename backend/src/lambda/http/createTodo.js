import 'source-map-support/register.js';
import { getUserId } from '../utils.mjs';
import { createTodo } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('createTodo');

const createTodoHandler = async (event) => {
  const newTodo = JSON.parse(event.body);
  const userId = getUserId(event);
  
  logger.info(`Creating a new todo for user ${userId}`);
  const todo = await createTodo(userId, newTodo);
  logger.info(`Todo created successfully for user ${userId}`);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'POST,OPTIONS'
    },
    body: JSON.stringify({
      item: todo
    })
  };
};

export const handler = createTodoHandler;