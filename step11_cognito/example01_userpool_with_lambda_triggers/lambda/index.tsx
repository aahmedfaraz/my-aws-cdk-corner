exports.handler = (event : any, context : any, callback : any) => {
    console.log(event);

    event.response.autoConfirmUser = true;

    // If EMAIL exists, mark it as VERIFIED
    if(event.request.userAttributes.hasOwnProperty("email")){
        event.response.autoVerifyEmail = true;
    }
    // If PHONE exists, mark it as VERIFIED
    if(event.request.userAttributes.hasOwnProperty("phone_number")){
        event.response.autoVerifyPhone = true;
    }
    
    // Return to Amazon Cognito
    return callback(null, event);
}