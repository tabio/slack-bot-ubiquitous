import { App } from "@slack/bolt";
import { postEphemeral } from "../utils";

export function searchUbiquitousCommand(app: App) {
  app.command("/ubiquitous-search", async ({ client, body, ack, logger }) => {
    await ack();

    const keyword = body.text;
    const user_id = body.user_id;
    const channel_id = body.channel_id;

    if (!keyword) {
      await postEphemeral(
        client,
        channel_id,
        user_id,
        "キーワードを入力してください"
      );
      return;
    }

    try {
      let message = `${keyword}が見つかりませんでした :innocent:`;
      await postEphemeral(client, channel_id, user_id, message);
    } catch (err) {
      logger.error(err);
    }
  });
}
