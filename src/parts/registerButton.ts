// 新規登録
export const registerButton = (keyword: string): any => {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `\`${keyword}\` が見つかりませんでした :innocent:`,
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "登録",
            emoji: true,
          },
          action_id: "register_button",
        },
      ],
    },
  ];
};
