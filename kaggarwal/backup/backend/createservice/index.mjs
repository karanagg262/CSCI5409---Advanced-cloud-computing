import AWS from 'aws-sdk';

AWS.config.update({region: 'us-east-1'});

const dynamoDB = new AWS.DynamoDB();


export const handler = async (event) => {
    const tenantdetails = event;

    const params = {
      TableName: 'servicedetails',
      Item: {
        'unitnumber': {S: tenantdetails.unitnumber},
        'email': {S: tenantdetails.email},
        'maintenance_type': {S: tenantdetails.maintenance_type},
        'comments': {S: tenantdetails.comments},
        'progress': {S: "UNDER REVIEW"}
      }
    };
  
    try {
      await dynamoDB.putItem(params).promise();
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
        body: JSON.stringify({ message: 'Service Created' })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
      },
        body: JSON.stringify({ message: error.message })
      };
    }
};