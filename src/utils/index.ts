import { WebClient } from "@slack/web-api/dist/WebClient";

// あなただけに表示させるメッセージ
export async function postEphemeral(
  client: WebClient,
  channel_id: string,
  user_id: string,
  text: string
) {
  await client.chat.postEphemeral({
    channel: channel_id,
    user: user_id,
    text: text,
  });
}

export const BOOK_ICONS = [
  ":book:",
  ":books:",
  ":notebook:",
  ":blue_book:",
  ":green_book:",
  ":closed_book:",
];
