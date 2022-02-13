import { App } from "@slack/bolt";
import { postEphemeral } from "../utils";
import { isConnected, DB_WATING_MESSAGE } from "../domains/connection";
import { updateUbiquitous } from "../domains/repositories/ubiquitous";

export function editUbiquitousView(app: App) {
  app.view(
    "keyword_edit_action",
    async ({ client, body, ack, view, logger }) => {
      await ack();

      const keyword = view.state.values.q_keyword.inputted.value || "";
      const detail = view.state.values.q_detail.inputted.value || "";
      const channel_id = JSON.parse(view.private_metadata).channel_id;
      const user_id = body.user.id;

      let isUpdated = false;
      let error = "";

      try {
        // DB check
        const enableDb = await isConnected();
        if (!enableDb) {
          await postEphemeral(client, channel_id, user_id, DB_WATING_MESSAGE);
          return;
        }

        await updateUbiquitous(keyword, detail)
          .then((_) => {
            isUpdated = true;
          })
          .catch((err) => {
            error = err;
          });

        const result = await client.chat.postEphemeral({
          channel: channel_id,
          user: user_id,
          text: `${keyword}の更新に${isUpdated ? "成功" : `失敗\n${error}`}`,
        });

        if (!result.ok) {
          logger.error(`更新成功メッセージ送信失敗 - ${result}`);
        }
      } catch (err) {
        logger.error(err);
      }
    }
  );
}
