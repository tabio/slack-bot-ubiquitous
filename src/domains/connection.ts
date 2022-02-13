import { Connection, createConnection } from "typeorm";
import { Ubiquitous } from "./entities/ubiquitous";

let connection: Connection;
export const DB_WATING_MESSAGE = "DB立ち上げ中に付き1分ほどお待ち下さい :bow:";

export async function makeConnection() {
  connection = await createConnection({
    type: "aurora-data-api",
    database: "slack_bot_db",
    secretArn: process.env.SECRET_ARN!,
    resourceArn: process.env.CLUSTER_ARN!,
    region: "ap-northeast-1",
    entities: [Ubiquitous],
  });
}

export async function isConnected(): Promise<boolean> {
  if (connection && connection.isConnected) {
    return true;
  }
  await makeConnection();
  return false;
}
