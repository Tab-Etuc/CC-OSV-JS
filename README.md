# CC-OSV-JS

這是一個使用 Deno、Discordeno 與 Lavalink 的 Discord
音樂機器人。專案已採用破壞式重構，不再保留舊版 Discordeno 的相容層。

## 開始使用

1. 安裝 Deno 2.x。
2. 複製 `.env.example` 為 `.env`，至少填入 `discordBotToken`。
3. 如果要使用音樂功能，啟動 Lavalink，並填入 `lavalinkHost`、`lavalinkPort` 與
   `lavalinkPassword`。
4. 執行 `deno task run`。

常用檢查指令：

```text
deno task check
deno task fmt
deno task lint
deno task test
deno task coverage
```

## 架構

- `src/base`：Discord Gateway 事件、資料庫連線與 Bot 執行個體。
- `src/classes`：指令註冊、Embed 與外部資料模型。
- `src/services`：跨指令共用的業務邏輯，目前包含音樂搜尋、佇列與播放控制。
- `src/utils`：快取、權限、訊息輸出、文字清理與其他純工具。
- `src/commands/message`、`src/commands/slash`：只負責解析輸入與呈現結果。
- `lavadeno`：專案內的 Lavalink 用戶端程式碼。

所有送往 Discord 的訊息都會經過文字清理，會移除 Unicode emoji、Discord 自訂
emoji 與 shortcode。

## 功能

### 音樂

- `play`：支援 YouTube 搜尋/連結、Spotify 連結與互動選曲。
- `queue`、`shuffle`、`remove`、`move`、`clearqueue`：完整管理待播佇列。
- `pause`、`resume`、`skip`、`seek`、`replay`、`volume`、`nightcore`。
- `bassboost`、`speed`、`vaporwave` 與 `history`；保留最近 25 首播放紀錄。
- `loop [off|track|queue]`：支援關閉、單曲循環與整個佇列循環。
- `nowplaying` 會附上按鈕，可直接暫停、跳過、隨機、循環與停止。
- `stop` / `leave`：停止播放、清空佇列並離開語音頻道。

### 社群與資料

- `rank`、`leaderboard [level|economy]`：聊天 XP、等級與排行榜。
- `balance`、`daily`、`pay`：每伺服器獨立的錢包、銀行、每日獎勵與轉帳。
- `warn`、`warnings`、`unwarn`：需要 `Manage Messages` 權限的警告紀錄。
- `remind`、`reminders`、`remindcancel`：最長 7 天的提醒排程（記憶體內）。

### 資訊與趣味

- `serverinfo`、`userinfo`、`avatar`、`status`、`botinfo`、`uptime`。
- `choose`、`roll`、`8ball`、`cat`、`meme`、`reddit`。
- 訊息前綴與 slash command 皆會自動載入；新增指令檔案後不需手動註冊。

## 必要設定

`discordBotToken` 是必要設定。`mongoDbUrl` 與 `spotifyToken`
都是選用設定；未設定 MongoDB
時，等級、經濟、警告與時間頻道功能會停用，其他功能仍可啟動。提醒功能不依賴
MongoDB，但機器人重啟後尚未送出的提醒不會保留。

## 開發注意事項

`deno task check` 會檢查整個入口依賴圖；`deno task test` 執行純工具測試。若使用
npx 取得 Deno runtime，可用 `npx --yes deno task check` 與
`npx --yes deno task test`。`deno task coverage` 會產生 LCOV 報告並要求整體
coverage 至少達到 60%；GitHub Actions 會在每次 push 與 pull request 自動執行
格式、lint、型別、測試與 coverage gate。
