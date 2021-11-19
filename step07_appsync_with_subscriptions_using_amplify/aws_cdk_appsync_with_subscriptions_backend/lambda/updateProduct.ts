import { DynamoDB } from 'aws-sdk';
const documentClient = new DynamoDB.DocumentClient();

type Product = {
    id: String
    title: String
    price: Number
}

const updateProduct = async ( product : Product ) => {
    const params = {
        TableName: process.env.PRODUCT_TABLE_NAME || '',
        Item: product
    }

    try {
        await documentClient.put(params).promise()
        return product;
    } catch (err) {
        console.log('Dynamo Error: ', err);
        return null;
    }
}

export default updateProduct;