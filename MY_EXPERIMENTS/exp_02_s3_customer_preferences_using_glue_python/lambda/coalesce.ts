var AWS = require("aws-sdk");
var glue = new AWS.Glue();

exports.handler = async () => {
  var params = {
    JobName: process.env.JOB_NAME /* required */,
  };
  const response = await glue.startJobRun(params).promise();
  console.log("Response ==> ", response);
};
