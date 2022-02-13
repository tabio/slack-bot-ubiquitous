import { App } from "@slack/bolt";
import { postEphemeral } from "../utils";
import { isConnected, DB_WATING_MESSAGE } from "../domains/connection";
import { saveUbiquitous } from "../domains/repositories/ubiquitous";

export function registerUbiquitousView(app: App) {
  app.view(
    "keyword_reg_action",
    async ({ client, body, ack, view, logger }) => {
      await ack();

      const keyword = view.state.values.q_keyword.inputted.value || "";
      const detail = view.state.values.q_detail.inputted.value || "";
      const channel_id = JSON.parse(view.private_metadata).channel_id;
      const user_id = body.user.id;

      let isRegistered = false;
      let error = "";

      try {
        // DB check
        const enableDb = await isConnected();
        if (!enableDb) {
          await postEphemeral(client, channel_id, user_id, DB_WATING_MESSAGE);
          return;
        }

        await saveUbiquitous(keyword, detail)
          .then((_) => {
            isRegistered = true;
          })
          .catch((err) => {
            error = err;
          });

        const result = await client.chat.postEphemeral({
          channel: channel_id,
          user: user_id,
          text: `${keyword}の登録に${isRegistered ? "成功" : `失敗\n${error}`}`,
        });

        if (!result.ok) {
          logger.error(`登録成功メッセージ送信失敗 - ${result}`);
        }
      } catch (err) {
        logger.error(err);
      }
    }
  );
}
