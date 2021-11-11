import { DynamoDB } from 'aws-sdk';
const documentClient = new DynamoDB.DocumentClient();

type AppSyncEvent = {
    info: {
        fieldName: String
    },
    arguments: {
        product: Product,
        productID: String
    }
}

type Product = {
    id: String,
    name: String,
    price: Number
}

exports.handler = async (event : AppSyncEvent) => {
    let params, data;
    switch (event.info.fieldName) {
        case "welcome":
            return "Hello World from DynamoLambda by Ahmed Faraz";
        case "addProduct":
            event.arguments.product.id = 'key-' + Math.random();
            params = {
                TableName: process.env.TABLE_NAME || "",
                Item: event.arguments.product
            }
            data = await documentClient.put(params).promise();
            console.log("After Adding, Data: ", data);
            return event.arguments.product;
        case "getProducts":
            params = {
                TableName: process.env.TABLE_NAME || ""
            }
            data = await documentClient.scan(params).promise();
            return
        case "updateProduct":
            params = {
                TableName: process.env.TABLE_NAME || "",
                Item: event.arguments.product
            }
            data = await documentClient.put(params).promise();
            console.log("After Updating, Data: ", data);
            return event.arguments.product;
        case "deleteProduct":
            params = {
                TableName: process.env.TABLE_NAME || "",
                Key: {
                    id: event.arguments.productID
                }
            }
            data = await documentClient.delete(params).promise();
            console.log("After Updating, Data: ", data);
            return event.arguments.product;
        default:
            return "Not Found";
    }
}