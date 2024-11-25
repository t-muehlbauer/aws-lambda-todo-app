import AWS from 'aws-sdk';
import AWSXRay from 'aws-xray-sdk';
import { createLogger } from '../utils/logger.mjs';

const XAWS = AWSXRay.captureAWS(AWS);

const logger = createLogger('TodosAccess');

export class TodosAccess {
  constructor(
    docClient = createDynamoDBClient(),
    todosTable = process.env.TODOS_TABLE,
    s3Bucket = process.env.ATTACHMENT_S3_BUCKET
  ) {
    this.docClient = docClient;
    this.todosTable = todosTable;
    this.s3Bucket = s3Bucket;
  }

  async createTodo(todo) {
    logger.info(`Creating a new todo with ID ${todo.todoId}`);

    const params = {
      TableName: this.todosTable,
      Item: todo
    };
    await this.docClient.put(params).promise();
    return todo;
  }

  async getTodosForUser(userId) {
    logger.info(`Getting all todos for user ${userId}`);

    const params = {
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    };
    const result = await this.docClient.query(params).promise();
    const items = result.Items;
    return items;
  }

  async updateTodo(userId, todoId, updatedTodo) {
    logger.info(`Updating todo with ID ${todoId}`);

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
    const item = result.Attributes;
    return item;
  }

  async updateAttachmentUrl(todoId, userId) {
    logger.info(`Updating attachment URL for todo with ID ${todoId}`);

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
    const item = result.Attributes;
    return item;
  }

  async deleteTodo(userId, todoId) {
    logger.info(`Deleting todo with ID ${todoId}`);

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

function createDynamoDBClient() {
  return new XAWS.DynamoDB.DocumentClient();
}