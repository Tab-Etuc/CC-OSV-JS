import { stripEmoji } from "@utils/text.ts";

Deno.test("輸出文字會移除 Unicode 與 Discord emoji", () => {
  const result = stripEmoji("  測試 🏓 1️⃣ <a:loading:123456789> :clock10:  ");
  if (result !== "測試") throw new Error(`結果不正確：${result}`);
});

Deno.test("一般文字與網址不會被錯誤移除", () => {
  const result = stripEmoji("歌曲 https://example.com/video");
  if (result !== "歌曲 https://example.com/video") {
    throw new Error("一般文字被錯誤修改");
  }
});
