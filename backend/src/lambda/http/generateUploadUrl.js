import 'source-map-support/register.js';
import { getUserId } from '../utils.mjs';
import { createAttachmentPresignedUrl } from '../../businessLogic/todos.mjs';
import { createLogger } from '../../utils/logger.mjs';

const logger = createLogger('generateUploadUrl');

const generateUploadUrlHandler = async (event) => {
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);

  logger.info(`Generating upload URL for todo with ID ${todoId} for user ${userId}`);
  
  const uploadUrl = await createAttachmentPresignedUrl(todoId, userId);
  
  logger.info(`Upload URL generated successfully for todo with ID ${todoId} for user ${userId}`);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'POST,OPTIONS'
    },
    body: JSON.stringify({
      uploadUrl
    })
  };
};

export const handler = generateUploadUrlHandler;