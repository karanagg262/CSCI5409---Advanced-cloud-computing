import AWS from 'aws-sdk';

AWS.config.update({region: 'us-east-1'});

const dynamoDB = new AWS.DynamoDB();
var SNS = new AWS.SNS()

export const handler = async (event) => {
    const tenantdetails = event;

    const params = {
      TableName: 'servicedetails',
      Item: {
        'unitnumber': {S: tenantdetails.unitnumber},
        'email': {S: tenantdetails.email},
        'maintenance_type': {S: tenantdetails.maintenance_type},
        'comments': {S: tenantdetails.comments},
      }
    };

    const sendmessage = {
      Protocol: 'EMAIL',
      TopicArn: 'arn:aws:sns:us-east-1:022210240442:term', 
      Endpoint: 'kr284229@dal.ca',
    }
  
    try {
      await dynamoDB.putItem(params).promise();

      await SNS.subscribe(sendmessage, (err, data)=> {
        console.log('Karan');
        console.log(err);
        console.log(data);
       if(err){
        return err;
       }
      })

    //   await SNS.publish(sendmessage, function(err, data) {
    //     if (err) {
    //         console.log(err)
    //         reject(err)
    //     } else {
    //         console.log(data)
    //         resolve(data)
    //     }
    // })
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