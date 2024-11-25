import 'source-map-support/register.js';
import { getUserId } from '../utils.mjs';
import { updateTodo } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('updateTodo');

const updateTodoHandler = async (event) => {
  const todoId = event.pathParameters.todoId;
  const updatedTodo = JSON.parse(event.body);
  
  const userId = getUserId(event);
  logger.info(`Updating todo with ID ${todoId} for user ${userId}`);

  await updateTodo(userId, todoId, updatedTodo);

  logger.info(`Todo with ID ${todoId} updated successfully for user ${userId}`);

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'PATCH,OPTIONS'
    },
    body: ''
  };
};

export const handler = updateTodoHandler;