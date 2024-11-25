import 'source-map-support/register';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { getUserId } from '../utils';
import { createAttachmentPresignedUrl } from '../../businessLogic/todos';
import { createLogger } from '../../utils/logger';

const logger = createLogger('getTodos');

export const handler = middy(async (event) => {
  logger.info('Processing event', { event });
  const todoId = event.pathParameters.todoId;
  const userId = getUserId(event);

  const uploadUrl = await createAttachmentPresignedUrl(todoId, userId);
  logger.info('Generated upload URL', { uploadUrl });

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