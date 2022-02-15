import { App, BlockButtonAction } from "@slack/bolt";
import { isConnected, DB_WATING_MESSAGE } from "../domains/connection";
import { registerUbiquitousModal } from "../parts";
import { registerUbiquitousView } from "../views";

export function registerButtonAction(app: App) {
  registerUbiquitousView(app);

  app.action<BlockButtonAction>(
    "register_button",
    async ({ ack, body, client, respond, logger }) => {
      await ack();

      // DB check
      if (!isConnected()) {
        await respond({
          response_type: "ephemeral",
          text: DB_WATING_MESSAGE,
        });
        return;
      }

      try {
        const metadata = JSON.stringify({ channel_id: body.channel?.id });
        const result = await client.views.open({
          trigger_id: body.trigger_id,
          view: registerUbiquitousModal(metadata),
        });
        if (!result.ok) {
          logger.info(`モーダルを起動できませんでした - ${result}`);
        }
      } catch (err) {
        logger.error("モーダル起動処理の失敗", err);
      }
    }
  );
}
