import { TodosAccess } from '../dataLayer/todosAccess.mjs';
import { AttachmentUtils } from '../dataLayer/attachmentUtils.mjs';
import { createLogger } from '../utils/logger.mjs';
import { v4 as uuidv4 } from 'uuid';

const todosAccess = new TodosAccess();
const attachmentUtils = new AttachmentUtils();
const logger = createLogger('Todos');

export async function createTodo(userId, todo) {
  logger.info(`Creating a new todo for user ${userId}`);

  const todoId = uuidv4();
  const createdAt = new Date().toISOString();
  const done = false;

  const newTodo = {
    userId,
    todoId,
    createdAt,
    done,
    ...todo
  };

  return await todosAccess.createTodo(newTodo);
}

export async function getTodosForUser(userId) {
  logger.info(`Fetching todos for user ${userId}`);
  return await todosAccess.getTodosForUser(userId);
}

export async function updateTodo(userId, todoId, updatedTodo) {
  logger.info(`Updating todo ${todoId} for user ${userId}`);
  return await todosAccess.updateTodo(userId, todoId, updatedTodo);
}

export async function deleteTodo(userId, todoId) {
  logger.info(`Deleting todo ${todoId} for user ${userId}`);
  return await todosAccess.deleteTodo(userId, todoId);
}

export async function createAttachmentPresignedUrl(todoId, userId) {
  logger.info(`Creating attachment presigned URL for todo ${todoId} for user ${userId}`);
  await todosAccess.updateAttachmentUrl(todoId, userId); // Update Todo attachment URL
  return await attachmentUtils.createAttachmentPresignedUrl(todoId);
}