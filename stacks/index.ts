import MyStack from "./MyStack";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import * as sst from "@serverless-stack/resources";

export default function main(app: sst.App): void {
  app.setDefaultFunctionProps((stack) => ({
    runtime: "nodejs14.x",
    environment: {
      SLACK_SIGNING_SECRET: StringParameter.valueFromLookup(
        stack,
        "slack-bot-signing-secret"
      ),
      SLACK_BOT_TOKEN: StringParameter.valueFromLookup(
        stack,
        "slack-bot-token"
      ),
    },
  }));

  new MyStack(app, "my-stack");
}
