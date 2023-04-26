import AWS from 'aws-sdk';

AWS.config.update({region: 'us-east-1'});

const dynamoDB = new AWS.DynamoDB();
var SNS = new AWS.SNS();

export const handler = async (event) => {
    const tenantdetails = JSON.parse(event);
    const email = tenantdetails.email;
    const params = {
      TableName: 'tenantDetails',
      Item: {
        'tenantid': {S: tenantdetails.email},
        'name': {S: tenantdetails.name},
        'unitnumber': {S: tenantdetails.unitnumber},
        'password': {S: tenantdetails.password},
        'TenantAutoPaymentEnabled': { BOOL: false }
      }
    };
    const sendmessage = {
      Protocol: 'EMAIL',
      TopicArn: process.env.SNSTopicArn, 
      Endpoint: email,
    }
    try {
      await dynamoDB.putItem(params).promise();
      console.log(email);
      await SNS.subscribe(sendmessage).promise();
      console.log('karab');
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
        body: JSON.stringify({ message: 'Account Created' })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
        body: JSON.stringify({ message: error.message, 
        email: tenantdetails.email, 
      newemail: email })
      };
    }
};
  

