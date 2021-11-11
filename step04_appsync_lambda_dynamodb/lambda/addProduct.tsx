import { DynamoDB } from "aws-sdk";
const documentClient = new DynamoDB.DocumentClient();

type Product = {
    id: String,
    name: String,
    price: Number
}

const addProduct = async ( product : Product ) => {
    product.id = 'key-' + Math.random();

    const params = {
        TableName: process.env.TABLE_NAME || '',
        Item: product
    }

    try {
        await documentClient.scan(params).promise();
        return product
    } catch (err) {
        console.log('DynamoDB Error: ', err);
        return null
    }
}

export default addProduct;