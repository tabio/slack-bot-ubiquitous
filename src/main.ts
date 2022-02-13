import { App, ExpressReceiver } from "@slack/bolt";
import { registerUbiquitousCommand, searchUbiquitousCommand } from "./commands";
const serverlessExpress = require("@vendia/serverless-express");
const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  processBeforeResponse: true,
});
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: expressReceiver,
  processBeforeResponse: true,
});

registerUbiquitousCommand(app);
searchUbiquitousCommand(app);

export const handler = serverlessExpress({ app: expressReceiver.app });
