import { Handler, Context } from "aws-lambda";
import { App, ExpressReceiver } from "@slack/bolt";
import {
  deleteButtonAction,
  editButtonAction,
  registerButtonAction,
  researchAction,
} from "./actions";
import { searchUbiquitousCommand } from "./commands";
import { makeConnection } from "./domains/connection";
import { countUbiquitous } from "./domains/repositories/ubiquitous";
import * as serverlessExpress from "@vendia/serverless-express";

let serverlessExpressInstance: Handler;
const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  processBeforeResponse: true,
});
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: expressReceiver,
  processBeforeResponse: true,
});

// actions
researchAction(app);
registerButtonAction(app);
editButtonAction(app);
deleteButtonAction(app);

// commands
searchUbiquitousCommand(app);

async function _setup(event: any, context: Context) {
  await makeConnection();

  // クエリを流さないと AuroraServerless は起動しない
  await countUbiquitous();

  serverlessExpressInstance = serverlessExpress.configure({
    app: expressReceiver.app,
  });
  return serverlessExpressInstance(event, context, () => {});
}

function _handler(event: any, context: Context) {
  if (serverlessExpressInstance)
    return serverlessExpressInstance(event, context, () => {});
  return _setup(event, context);
}

export const handler = _handler;
