import { DynamoDB } from 'aws-sdk';
const documentClient = new DynamoDB.DocumentClient();

type Product = {
    id: String,
    name: String,
    price: Number
}

const updateProduct = async ( product : Product ) => {
    const params = {
        TableName: process.env.TABLE_NAME || '',
        Item: product
    }
    
    try {
        await documentClient.put(params).promise();
        return product;
    } catch (error) {
        console.log('DynamoDb Error: ', error);
        return null
    }
}

export default updateProduct;