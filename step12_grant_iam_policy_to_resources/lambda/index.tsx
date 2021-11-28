import { DynamoDB } from 'aws-sdk';
const documentClient = new DynamoDB.DocumentClient();

type AppSyncEvent = {
    info: {
        fieldName: String,
    },
    arguments: {
        id: String,
        title: String
    }
}

exports.handler = async (event : AppSyncEvent) => {
    let params, data;
    switch(event.info.fieldName) {
        case 'welcome':
            return "Hi! IAM User, Welcome from Ahmed Faraz";
            
        case 'getData':
            params = {
                TableName: process.env.TABLE_NAME || ''
            }
            data = await documentClient.scan(params).promise();
            return data.Items;

        case 'addData':
            params = {
                TableName: process.env.TABLE_NAME || '',
                Item: {
                    id: `key-${Math.random()}`,
                    title: event.arguments.title,
                }
            }
            data = await documentClient.put(params).promise();
            return params.Item;

        case 'deleteData':
            params = {
                TableName: process.env.TABLE_NAME || '',
                Key: {
                    id: event.arguments.id
                }
            }
            data = await documentClient.delete(params).promise();
            return data;

        default:
            return "Not Found";
    }
}