import { App, BlockButtonAction } from "@slack/bolt";
import { findOneUbiquitous } from "../domains/repositories/ubiquitous";
import { isConnected, DB_WATING_MESSAGE } from "../domains/connection";
import { editUbiquitousModal } from "../parts";
import { editUbiquitousView } from "../views";

export function editButtonAction(app: App) {
  editUbiquitousView(app);

  app.action<BlockButtonAction>(
    "edit_button",
    async ({ ack, action, body, client, respond, logger }) => {
      await ack();

      // DB check
      const enableDb = await isConnected();
      if (!enableDb) {
        await respond({
          response_type: "ephemeral",
          text: DB_WATING_MESSAGE,
        });
        return;
      }

      try {
        const metadata = JSON.stringify({ channel_id: body.channel?.id });
        const ubiquitous = await findOneUbiquitous(action.value);
        const result = await client.views.open({
          trigger_id: body.trigger_id,
          view: editUbiquitousModal(metadata, ubiquitous),
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
