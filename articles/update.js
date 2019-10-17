'use strict';

const aws = require('aws-sdk');
const dynamo = new aws.DynamoDB.DocumentClient();

module.exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body)
  const paramName = data.paramName;
  const paramValue = data.paramValue;
  console.log('article_id to update:', data.article_id)
  console.log('paramName to update:', data.paramName)
  console.log('paramValue to update:', data.paramValue)
  console.log('data', data)

  if(data.article_id && typeof data.article_id !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Body did not contain an article_id property'));
    return;
  }

  // TODO: add validation for paramName and paramValue

  const params = {
    TableName: 'BlogTable',
    Key: {
      article_id: data.article_id,
    },
    ConditionExpression:'attribute_exists(article_id)',
    UpdateExpression: 'set ' + data.paramName + ' = :v',  // dynamically say what value to set
    ExpressionAttributeValues: {
        ':v': paramValue
    },
    ReturnValues: 'ALL_NEW'
  }
  const updateCallback = (error, result) => {
    if(error) {
      console.error("unable to update article.  Error JSON:", JSON.stringify(error, null, 2))
    } else {
      console.log(result)  // result here is blank because it doesn't return anything
      const response = {
        statusCode: 200,
        body: JSON.stringify(result),
      };
      return callback(null, response);  
    }
  }

  dynamo.update(params, updateCallback)
};