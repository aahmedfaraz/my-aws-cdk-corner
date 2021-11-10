import { DynamoDB } from 'aws-sdk';
const documentClient = new DynamoDB.DocumentClient();

type AppSyncEvent = {
    info: {
        fieldName: String
    },
    arguments: {
        product: Product
    }
}

type Product = {
    id: String,
    name: String,
    price: Number
}

exports.handler = async (event : AppSyncEvent) => {
    switch (event.info.fieldName) {
        case "welcome":
            return "Hello World from DynamoLambda by Ahmed Faraz";
        case "addProduct":
            event.arguments.product.id = 'key-' + Math.random();
            const params = {
                TableName: process.env.TABLE_NAME || "",
                Item: event.arguments.product
            }
            const data = await documentClient.put(params).promise();
            console.log("After Adding, Data: ", data);
            return event.arguments.product;
        default:
            return "Not Found";
    }
}