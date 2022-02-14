import { App, ExpressReceiver } from "@slack/bolt";
import {
  deleteButtonAction,
  editButtonAction,
  registerButtonAction,
  researchAction,
} from "./actions";
import { searchUbiquitousCommand } from "./commands";
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

researchAction(app);
registerButtonAction(app);
editButtonAction(app);
deleteButtonAction(app);

searchUbiquitousCommand(app);

export const handler = serverlessExpress({ app: expressReceiver.app });
