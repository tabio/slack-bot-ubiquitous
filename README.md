# slack-bot-ubiquitous

チームのユビキタス言語を管理するための Slack Bot

### ハイレベルアーキテクチャ

![ハイレベルアーキテクチャ](./images/architecture.png)

### 事前準備

- SSM に以下のパラメーターストアを登録
  - slack-bot-signing-secret
  - slack-bot-token
- デプロイ
  ```sh
  npm install
  npx sst deploy
  ```
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
