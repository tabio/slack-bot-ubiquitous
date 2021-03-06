import { App, BlockButtonAction } from "@slack/bolt";
import {
  incrementHitUbiquitous,
  findOneUbiquitous,
} from "../domains/repositories/ubiquitous";
import { isConnected, DB_WATING_MESSAGE } from "../domains/connection";
import { foundKeywordBlock } from "../parts";

export function researchAction(app: App) {
  app.action<BlockButtonAction>(
    /research_button_\d/,
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

      const ubiquitous = await findOneUbiquitous(action.value);

      // 検索回数の更新
      await incrementHitUbiquitous(ubiquitous);

      await respond({
        response_type: "ephemeral",
        blocks: foundKeywordBlock(ubiquitous),
      });
    }
  );
}
