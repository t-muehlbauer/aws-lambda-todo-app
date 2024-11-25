import 'source-map-support/register.js';
import * as middy from 'middy';
import { cors } from 'middy/middlewares.js';
import { getUserId } from '../utils.mjs';
import { createAttachmentPresignedUrl } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('generateUploadUrl');

export const handler = middy(async (event) => {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);

  logger.info(`Generating upload URL for todo with ID ${todoId} for user ${userId}`);

  const uploadUrl = await createAttachmentPresignedUrl(todoId, userId);

  logger.info(`Upload URL generated successfully for todo with ID ${todoId} for user ${userId}`);

  return {
    statusCode: 200,
    body: JSON.stringify({
      uploadUrl
    })
  };
});

handler.use(
  cors({
    credentials: true
  })
);