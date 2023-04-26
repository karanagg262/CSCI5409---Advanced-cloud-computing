import AWS from 'aws-sdk';

AWS.config.update({region: 'us-east-1'});

const dynamoDB = new AWS.DynamoDB();
var SNS = new AWS.SNS();

export const handler = async (event) => {
    console.log(event.email);
    const tenantdetails = event;

    const params = {
      TableName: 'tenantDetails',
      Key: {
        'tenantid': {S: tenantdetails.email},
      }
    };
    const sendmessage = {
      Subject: "Summer Event!!", 
      Message: "Hey all, Do join us for a singing competition on 31st April 2023",
      TopicArn: process.env.SNSTopicArn, 
    }
    console.log(sendmessage);
    try {
      const data = await dynamoDB.getItem(params).promise();

      await SNS.publish(sendmessage).promise();

      console.log(Object.keys(data).length);
      if(Object.keys(data).length){
        return {
          statusCode: 200,
          headers: {
              "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
          },
          body: JSON.stringify(data) 
        };
      } else {
        return {
          statusCode: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
          },
          body: JSON.stringify({ message: error.message })         
        }
      }

    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
        },
        body: JSON.stringify({ message: error.message })
      };
    }
};
