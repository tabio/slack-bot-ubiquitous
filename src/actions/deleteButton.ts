import { App, BlockButtonAction } from "@slack/bolt";
import { deleteUbiquitous } from "../domains/repositories/ubiquitous";
import { isConnected, DB_WATING_MESSAGE } from "../domains/connection";

export function deleteButtonAction(app: App) {
  app.action<BlockButtonAction>(
    "delete_button",
    async ({ ack, action, respond }) => {
      await ack();

      // DB check
      if (!isConnected()) {
        await respond({
          response_type: "ephemeral",
          text: DB_WATING_MESSAGE,
        });
        return;
      }

      await deleteUbiquitous(action.value);
      await respond({
        response_type: "ephemeral",
        text: "削除完了",
      });
    }
  );
}
