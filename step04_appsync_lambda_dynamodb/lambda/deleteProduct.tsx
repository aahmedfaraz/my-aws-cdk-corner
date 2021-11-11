import { DynamoDB } from 'aws-sdk';
const documentClient = new DynamoDB.DocumentClient();

const deleteProduct = async ( productID : String ) => {
    const params = {
        TableName: process.env.TABLE_NAME || '',
        Key: {
            id: productID
        }
    }
    try {
        await documentClient.delete(params).promise();
        return productID;
    } catch (error) {
        console.log('DynamoDB Error: ', error);
        return null
    }
}

export default deleteProduct;