import { App, BlockButtonAction } from "@slack/bolt";
import { findOneUbiquitous } from "../domains/repositories/ubiquitous";
import { isConnected, DB_WATING_MESSAGE } from "../domains/connection";
import { BOOK_ICONS } from "../utils";

export function researchAction(app: App) {
  app.action<BlockButtonAction>(
    /research_button_\d/,
    async ({ ack, action, respond }) => {
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

      const ubiquitous = await findOneUbiquitous(action.value);
      const icon = BOOK_ICONS[Math.floor(Math.random() * BOOK_ICONS.length)];
      await respond({
        response_type: "ephemeral",
        text: `${icon} ${ubiquitous.keyword}\n${ubiquitous.detail}`,
      });
    }
  );
}
