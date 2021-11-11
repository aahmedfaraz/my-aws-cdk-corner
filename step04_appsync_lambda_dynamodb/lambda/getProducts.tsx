import { DynamoDB } from "aws-sdk";
const documentClient = new DynamoDB.DocumentClient();

const getProducts = async () => {
    const params = {
        TableName: process.env.TABLE_NAME || ''
    }
    try {
        const data = await documentClient.scan(params).promise();
        return data.Items
    } catch (err) {
        console.log('DynamoDB Error: ', err);
        return null
    }
}

export default getProducts;