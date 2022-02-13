import { Ubiquitous } from "../domains/entities/ubiquitous";

// キーワード編集モーダル
export const editUbiquitousModal = (
  data: string,
  ubiquitous: Ubiquitous
): any => {
  return {
    type: "modal",
    callback_id: "keyword_edit_action",
    private_metadata: data,
    title: {
      type: "plain_text",
      text: "キーワードの更新",
    },
    submit: {
      type: "plain_text",
      text: "更新",
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
          initial_value: ubiquitous.keyword,
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
          initial_value: ubiquitous.detail,
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
