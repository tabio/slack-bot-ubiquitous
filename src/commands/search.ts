import { App } from "@slack/bolt";
import { isConnected, DB_WATING_MESSAGE } from "../domains/connection";
import {
  findLikeUbiquitous,
  findOneUbiquitous,
} from "../domains/repositories/ubiquitous";
import { Ubiquitous } from "../domains/entities/ubiquitous";
import { researchButton } from "../parts";
import { BOOK_ICONS } from "../utils";

export function searchUbiquitousCommand(app: App) {
  app.command("/ubiquitous-search", async ({ body, ack, logger, respond }) => {
    await ack();

    const keyword = body.text;
    if (!keyword) {
      await respond({
        response_type: "ephemeral",
        text: "キーワードを入力してください",
      });
      return;
    }

    try {
      // DB check
      const enableDb = await isConnected();
      if (!enableDb) {
        await respond({
          response_type: "ephemeral",
          text: DB_WATING_MESSAGE,
        });
        return;
      }

      // 完全一致
      const ubiquitous = await findOneUbiquitous(keyword);
      if (ubiquitous) {
        const icon = BOOK_ICONS[Math.floor(Math.random() * BOOK_ICONS.length)];
        await respond({
          response_type: "ephemeral",
          text: `${icon} ${ubiquitous.keyword}\n${ubiquitous.detail}`,
        });
      } else {
        // 部分一致
        const ubiquitouses = await findLikeUbiquitous(keyword);
        if (ubiquitouses.length) {
          await respond({
            response_type: "ephemeral",
            blocks: researchButton(
              ubiquitouses.map((ubiquitous: Ubiquitous) => ubiquitous.keyword)
            ),
          });
        } else {
          // 存在しない
          await respond({
            response_type: "ephemeral",
            text: `【${keyword}】が見つかりませんでした :innocent:`,
          });
        }
      }
    } catch (err) {
      logger.error(err);
    }
  });
}
