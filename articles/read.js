'use strict';

const aws = require('aws-sdk');
const dynamo = new aws.DynamoDB.DocumentClient();

module.exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body)
  console.log(data.article_id)

  if(data.text && typeof data.text !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Body did not contain a text property'));
    return;
  }

  const params = {
    TableName: 'BlogTable',
    Key: {
      article_id: data.article_id
    }
  }
  const getCallback = (error, result) => {
    if(error) {
      console.error("unable to get article.  Error JSON:", JSON.stringify(error, null, 2))
    } else {
      const response = {
        statusCode: 200,
        body: JSON.stringify(result),
      };
      return callback(null, response);  
    }
  }

  dynamo.get(params, getCallback)
};