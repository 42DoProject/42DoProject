import * as AWS from "aws-sdk";
import * as awsS3 from "./s3";

const option = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
};

export async function init() {
  AWS.config.update(option);

  await awsS3.ready();
}
