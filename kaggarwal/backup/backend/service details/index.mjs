import AWS from 'aws-sdk';

AWS.config.update({region: 'us-east-1'});

const dynamoDB = new AWS.DynamoDB();

export const handler = async (event) => {
    console.log(event);
    const tenantdetails = event;

    const params = {
      TableName: 'servicedetails',
      Key: {
        'unitnumber': {S: tenantdetails.unitnumber},
      }
    };
  
    try {
      const data = await dynamoDB.getItem(params).promise();
      return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify(data) 
      };
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
  

