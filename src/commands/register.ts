import { App } from "@slack/bolt";
import { registerUbiquitousModal } from "../modals";
import { registerUbiquitousView } from "../views";

export function registerUbiquitousCommand(app: App) {
  registerUbiquitousView(app);

  app.command("/ubiquitous-reg", async ({ client, body, ack, logger }) => {
    await ack();
    const metadata = JSON.stringify({ channel_id: body.channel_id });
    try {
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
  });
}
