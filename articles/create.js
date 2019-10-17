'use strict';

const aws = require('aws-sdk');
const dynamo = new aws.DynamoDB.DocumentClient();
const uuid = require('uuid');

module.exports.handler = (event, context, callback) => {
  const data = JSON.parse(event.body)
  // console.log('data.text', data.text)
  if(data.text && typeof data.text !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Body did not contain a text property'));
    return;
  }

  const params = {
    TableName: 'BlogTable',
    Item: {
      article_id: uuid.v1(),
      text: data.text
    }
  }
  const putCallback = (error, result) => {
    if(error) {
      console.error("unable to save article.  Error JSON:", JSON.stringify(error, null, 2))
    } else {
      // console.log(result);  // result here is blank because we're creating something new and put method only has option to return none or old value (in situations like an update)
      const response = {
        statusCode: 200,
        body: JSON.stringify(params.Item.article_id),
      };
      return callback(null, response);  
    }
  }

  dynamo.put(params, putCallback)
 
};
