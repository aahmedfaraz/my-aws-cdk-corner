import * as AWS from 'aws-sdk';
import { APIGatewayEvent } from 'aws-lambda';

const Dynamo = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (e : APIGatewayEvent) => {
    
    // =======================================================================================
    // 
    // OUR OBJECTIVE:
    // - Get Input Item of Deleted Account User and Add in Database (with DeleteCount = 1).
    // - If User is already present in the Database - Increment DeleteCount by 1.
    // 
    // OUT SOLUTION STEP BY STEP:
    // 1. Find if User is already present (GET req on DB).
    // 2. If Found User > Increment DeleteCount by 1.
    // 3. If Not Found User > Leave Input Item as it is.
    // 4. Add the Manipulated Item inside Database (PUT req on DB), this will Add and Update both.
    // 
    // =======================================================================================

    // ======================================================================
    // This is the Item We will be getting from Event (with DeleteCount = 1)
    // ======================================================================
    let item : any = {
        email: 'ahmed@gmail.com',
        serviceName: 'Hybris',
        totalCount: 1
    };
    
    // ======================================================================
    // Try Catch - Because we are about to work with Database.
    // ======================================================================
    try {
        // ======================================================================
        // 1. Find If User already Exist in Database
        // ======================================================================
        const data = await Dynamo.get({
            TableName: TABLE_NAME || '',
            Key: {
                email: item.email,
                serviceName: item.serviceName
            },
        }).promise();
        // ======================================================================
        // 2. If User Found - Increment DeleteCount by 1
        // ======================================================================
        if(data.Item) {
            item = data.Item;
            item.totalCount++;
        }
        // ======================================================================
        // 3. Put the Final Item inside Database
        // ======================================================================
        const finalItem = await Dynamo.put({
            TableName: TABLE_NAME || '',
            Item: item
        }).promise();
        console.log("Final Item ==> ", finalItem);
    } catch (err) {
        console.log("Error ==> ", err);
    }
}