import 'source-map-support/register.js';
import { getUserId } from '../utils.mjs';
import { deleteTodo } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('deleteTodo');

const deleteTodoHandler = async (event) => {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);
  
  logger.info(`Deleting todo with ID ${todoId} for user ${userId}`);
  await deleteTodo(userId, todoId);
  logger.info(`Todo with ID ${todoId} deleted successfully for user ${userId}`);

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'DELETE,OPTIONS'
    },
    body: ''
  };
};

export const handler = deleteTodoHandler;