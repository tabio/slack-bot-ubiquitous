# slack-bot-ubiquitous

チームのユビキタス言語を管理するための Slack Bot

### ハイレベルアーキテクチャ

![ハイレベルアーキテクチャ](./images/architecture.png)

Boltは内部でExpressを利用している

### 事前準備

- SSM に以下のパラメーターストアを登録
  - slack-bot-signing-secret
    ![signing-secret](./images/signing-secret.png)
  - slack-bot-token
    ![bot-token](./images/slack-bot-token.png)
- デプロイ
  ```sh
  npm install
  npx sst deploy
  ```
- slack app -> Lambda の疎通確認
  - Request URLにエンドポイントを入力しておく
    ![interactivity-shourtcuts](./images/interactivity-shortcuts.png)
  - Request URLにエンドポイントを入力してVerifiedになること(失敗する場合はLambdaのログを確認)
  - Add Workspace Eventに追加しないと保存できない
    ![event-subscription](./images/event-subscription.png)
- AWS Console -> RDS -> クエリエディタ から Table を作成
  ![クエリエディタ](./images/query-editor.png)
  ```sql
  CREATE TABLE ubiquitous (
    id INT UNSIGNED AUTO_INCREMENT NOT NULL PRIMARY KEY,
    keyword TEXT NOT NULL,
    FULLTEXT (keyword) WITH PARSER ngram,
    detail TEXT NOT NULL
  ) DEFAULT CHARSET = utf8 ENGINE=InnoDB;
  ```

### デバッグ

```sh
npx sst start
```
