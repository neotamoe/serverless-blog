'use strict';

const aws = require('aws-sdk');
const dynamo = new aws.DynamoDB.DocumentClient();

module.exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body)
  console.log('article_id to delete:', data.article_id)

  if(data.article_id && typeof data.article_id !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Body did not contain an article_id property'));
    return;
  }

  const params = {
    TableName: 'BlogTable',
    Key: {
      article_id: data.article_id
    },
    ReturnValuesOnConditionCheckFailure: 'ALL_OLD'
  }
  const deleteCallback = (error, result) => {
    if(error) {
      console.error("unable to delete article.  Error JSON:", JSON.stringify(error, null, 2))
    } else {
      // console.log(result)  // result here is blank because it doesn't return anything
      const response = {
        statusCode: 200,
        body: JSON.stringify(`deleted record with article_id: ${data.article_id}`),
      };
      return callback(null, response);  
    }
  }

  dynamo.delete(params, deleteCallback)
};