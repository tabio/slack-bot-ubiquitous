import { randomIcon } from "../utils";
import { Ubiquitous } from "../domains/entities/ubiquitous";

// 完全一致結果
export const foundKeywordBlock = (ubiquitous: Ubiquitous): any => {
  const message = `${randomIcon()} ${ubiquitous.keyword}\n${ubiquitous.detail}`;

  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: message,
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "削除",
            emoji: true,
          },
          style: "danger",
          action_id: "delete_button",
          value: `${ubiquitous.id}`,
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "編集",
            emoji: true,
          },
          style: "primary",
          action_id: "edit_button",
          value: `${ubiquitous.keyword}`,
        },
      ],
    },
  ];
};
