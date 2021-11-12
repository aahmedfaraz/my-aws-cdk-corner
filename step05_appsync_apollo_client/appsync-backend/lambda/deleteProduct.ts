import { DynamoDB } from 'aws-sdk';
const documentClient = new DynamoDB.DocumentClient();

const deleteProduct = async ( productID : String ) => {
    const params = {
        TableName: process.env.PRODUCT_TABLE_NAME || '',
        Key: {
            id: productID
        }
    }

    try {
        await documentClient.delete(params).promise();
        return 'Deleted Successfully'
    } catch (err) {
        console.log('Dynamo Error: ', err);
        return null;
    }
}

export default deleteProduct;