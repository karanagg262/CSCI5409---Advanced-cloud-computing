import AWS from 'aws-sdk';

export const handler = async(event) => {
    const sqs = new AWS.SQS({ region: 'us-east-1' });
    const connectqueueUrl = 'https://sqs.us-east-1.amazonaws.com/022210240442/connect';
    const subscribequeueUrl = 'https://sqs.us-east-1.amazonaws.com/022210240442/subscribe';
    const publishqueueUrl = 'https://sqs.us-east-1.amazonaws.com/022210240442/publish';

    if(event.type == "CONNECT"){
        const params = {
            QueueUrl: connectqueueUrl,
            WaitTimeSeconds: 20,
            MaxNumberOfMessages: 1
        };
        try {
            while (true) {
                const data = await sqs.receiveMessage(params).promise();
                const messages = data.Messages;
                if (messages && messages.length > 0) {
                    const message = JSON.parse(messages[0].Body);
                    const newjson = {
                        type: "CONNACK",
                        returnCode: 0,
                        username: message.username,
                        password: message.password
                    }
                    const deleteParams = {
                        QueueUrl: connectqueueUrl,
                        ReceiptHandle: messages[0].ReceiptHandle,
                      };
                    await sqs.deleteMessage(deleteParams).promise();
                    return newjson;
                }
            }

        } catch (err) {
            console.error(err);
        }
    } else if (event.type == "SUBSCRIBE"){
        const params = {
            QueueUrl: subscribequeueUrl,
            WaitTimeSeconds: 20,
            MaxNumberOfMessages: 1
        };
        try {
            while (true) {
                const data = await sqs.receiveMessage(params).promise();
                const messages = data.Messages;
                if (messages && messages.length > 0) {
                    const newjson = {
                        type: "SUBACK",
                        returnCode: 0
                    }
                    const deleteParams = {
                        QueueUrl: subscribequeueUrl,
                        ReceiptHandle: messages[0].ReceiptHandle,
                      };
                    await sqs.deleteMessage(deleteParams).promise();
                    return newjson;
                }
            }

        } catch (err) {
            console.error(err);
        }
    } else if (event.type == "PUBLISH"){
        const params = {
            QueueUrl: publishqueueUrl,
            WaitTimeSeconds: 20,
            MaxNumberOfMessages: 1
        };
        try {
            while (true) {
                const data = await sqs.receiveMessage(params).promise();
                const messages = data.Messages;
                if (messages && messages.length > 0) {
                    const message = JSON.parse(messages[0].Body);
                    const newjson = {
                        type: "PUBACK",
                        returnCode: 0,
                        payload: {
                            key: message.payload.key,
                            value: message.payload.value
                        }
                    }
                    const deleteParams = {
                        QueueUrl: publishqueueUrl,
                        ReceiptHandle: messages[0].ReceiptHandle,
                      };
                    await sqs.deleteMessage(deleteParams).promise();
                    return newjson;
                }
            }

        } catch (err) {
            console.error(err);
        }
    }
};
