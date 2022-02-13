// キーワード登録モーダル
export const registerUbiquitousModal = (data: string): any => {
  return {
    type: "modal",
    callback_id: "keyword_reg_action",
    private_metadata: data,
    title: {
      type: "plain_text",
      text: "キーワードの登録",
    },
    submit: {
      type: "plain_text",
      text: "登録",
    },
    close: {
      type: "plain_text",
      text: "キャンセル",
    },
    blocks: [
      {
        type: "input",
        block_id: "q_keyword",
        element: {
          type: "plain_text_input",
          action_id: "inputted",
          placeholder: {
            type: "plain_text",
            text: "キーワードを入力してください",
          },
        },
        label: {
          type: "plain_text",
          text: "キーワード",
        },
      },
      {
        type: "input",
        block_id: "q_detail",
        element: {
          type: "plain_text_input",
          action_id: "inputted",
          placeholder: {
            type: "plain_text",
            text: "詳細を入力してください",
          },
          multiline: true,
        },
        label: {
          type: "plain_text",
          text: "詳細",
        },
      },
    ],
  };
};
