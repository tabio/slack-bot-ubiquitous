// 再検索ボタン
export const researchButton = (keywords: string[]): any => {
  const buttons = keywords.map((keyword, index) => {
    const button = {
      type: "button",
      text: {
        type: "plain_text",
        text: `${keyword}`,
        emoji: true,
      },
      style: "primary",
      action_id: `research_button_${index}`,
      value: `${keyword}`,
    };
    return button;
  });

  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: "もしかして:question:",
      },
    },
    {
      type: "actions",
      elements: buttons,
    },
  ];
};
