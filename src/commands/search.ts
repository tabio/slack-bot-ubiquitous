import { App } from "@slack/bolt";
import { postEphemeral } from "../utils";
import { isConnected, DB_WATING_MESSAGE } from "../domains/connection";
import {
  findLikeUbiquitous,
  findOneUbiquitous,
} from "../domains/repositories/ubiquitous";

const BOOK_ICONS = [
  ":book:",
  ":books:",
  ":notebook:",
  ":blue_book:",
  ":green_book:",
  ":closed_book:",
];

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
      // DB check
      const enableDb = await isConnected();
      if (!enableDb) {
        await postEphemeral(client, channel_id, user_id, DB_WATING_MESSAGE);
        return;
      }

      // 完全一致
      let message = "";
      const ubiquitous = await findOneUbiquitous(keyword);
      if (ubiquitous) {
        const icon = BOOK_ICONS[Math.floor(Math.random() * BOOK_ICONS.length)];
        message = `${icon} ${ubiquitous.keyword}\n${ubiquitous.detail}`;
      } else {
        // 部分一致
        const ubiquitouses = await findLikeUbiquitous(keyword);
        for (const ubiquitous of ubiquitouses) {
          // TODO: ボタンにする
          message += `【${ubiquitous.keyword}】\n\n${ubiquitous.detail}\n\n`;
        }
      }

      await postEphemeral(
        client,
        channel_id,
        user_id,
        message || `【${keyword}】が見つかりませんでした :innocent:`
      );
    } catch (err) {
      logger.error(err);
    }
  });
}
