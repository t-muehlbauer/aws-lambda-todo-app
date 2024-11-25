import * as AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';
import { createLogger } from '../utils/logger.mjs';

const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('AttachmentUtils');

export class AttachmentUtils {
  constructor() {
    this.s3 = createS3Client();
    this.s3Bucket = process.env.ATTACHMENT_S3_BUCKET;
    this.s3SignedUrlExpiration = process.env.SIGNED_URL_EXPIRATION;
  }

  async createAttachmentPresignedUrl(todoId) {
    logger.info(`Creating presigned URL for todo ${todoId}`);

    const params = {
      Bucket: this.s3Bucket,
      Key: todoId,
      Expires: parseInt(this.s3SignedUrlExpiration)
    };

    const url = this.s3.getSignedUrl('putObject', params);
    logger.info(`Presigned URL created: ${url}`);

    return url;
  }
}

function createS3Client() {
  return new XAWS.S3({
    signatureVersion: 'v4'
  });
}