import * as AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';
import { createLogger } from '../utils/logger.mjs';

const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('TodosAccess');

export class TodosAccess {
  constructor() {
    this.docClient = new XAWS.DynamoDB.DocumentClient();
    this.todosTable = process.env.TODOS_TABLE;
    this.s3Bucket = process.env.ATTACHMENT_S3_BUCKET;
  }

  async createTodo(todo) {
    logger.info(`Creating todo ${todo.todoId}`);

    const params = {
      TableName: this.todosTable,
      Item: todo
    };

    await this.docClient.put(params).promise();
    return todo;
  }

  async getTodosForUser(userId) {
    logger.info(`Fetching todos for user ${userId}`);

    const params = {
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    };

    const result = await this.docClient.query(params).promise();
    return result.Items;
  }

  async updateTodo(userId, todoId, updatedTodo) {
    logger.info(`Updating todo ${todoId} for user ${userId}`);

    const params = {
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      },
      UpdateExpression: 'set #name = :name, #dueDate = :dueDate, #done = :done',
      ExpressionAttributeNames: {
        '#name': 'name',
        '#dueDate': 'dueDate',
        '#done': 'done'
      },
      ExpressionAttributeValues: {
        ':name': updatedTodo.name,
        ':dueDate': updatedTodo.dueDate,
        ':done': updatedTodo.done
      },
      ReturnValues: 'ALL_NEW'
    };

    const result = await this.docClient.update(params).promise();
    return result.Attributes;
  }

  async updateAttachmentUrl(todoId, userId) {
    logger.info(`Updating attachment URL for todo ${todoId}`);

    const attachmentUrl = `https://${this.s3Bucket}.s3.amazonaws.com/${todoId}`;

    const params = {
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      },
      UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
      ExpressionAttributeNames: {
        '#attachmentUrl': 'attachmentUrl'
      },
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      },
      ReturnValues: 'ALL_NEW'
    };

    const result = await this.docClient.update(params).promise();
    return result.Attributes;
  }

  async deleteTodo(userId, todoId) {
    logger.info(`Deleting todo ${todoId} for user ${userId}`);

    const params = {
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      }
    };

    await this.docClient.delete(params).promise();
  }
}