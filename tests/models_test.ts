import { COLORS } from "@const/colors.ts";
import { EMBED } from "@const/globalLimit.ts";
import { EmptyError, OverflowError } from "@const/errors.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { Reddit } from "@classes/reddit.ts";
import { assert, assertDeepEquals, assertEquals } from "./helpers.ts";

Deno.test("Embed builder 會清理文字、限制長度並輸出 Discord 格式", () => {
  const embed = new CCOSVEmbed()
    .setTitle("標題 🏓")
    .setDesc("內容 :ok:")
    .setAuthor("作者")
    .setFooter("頁尾")
    .setURL("https://example.com")
    .setColor("#ff0000")
    .addField("欄位", "值", true)
    .setTime(0);
  const json = embed.build()[0]!;
  assertEquals(json.title, "標題");
  assertEquals(json.description, "內容");
  assertEquals(json.color, 0xff0000);
  assertEquals(json.fields?.length, 1);
  assertEquals(json.timestamp, "1970-01-01T00:00:00.000Z");

  let titleFailed = false;
  try {
    new CCOSVEmbed().setTitle("x".repeat(EMBED.TITLE + 1));
  } catch (error) {
    titleFailed = error instanceof OverflowError;
  }
  assert(titleFailed, "過長標題應拋出 OverflowError");

  let colorFailed = false;
  try {
    new CCOSVEmbed().setColor("#ffffff0");
  } catch (error) {
    colorFailed = error instanceof RangeError;
  }
  assert(colorFailed, "無效顏色應拋出 RangeError");
  assertEquals(new CCOSVEmbed().setColor(COLORS.BLUE).color, COLORS.BLUE);
});

Deno.test("Embed 欄位與描述限制會被 enforced", () => {
  let fieldFailed = false;
  try {
    new CCOSVEmbed().addField("x", "x".repeat(EMBED.FIELD_VALUE + 1));
  } catch (error) {
    fieldFailed = error instanceof OverflowError;
  }
  assert(fieldFailed, "過長欄位應失敗");

  const embed = new CCOSVEmbed();
  for (let index = 0; index < EMBED.FIELDS; index++) {
    embed.addField(String(index), "value");
  }
  let countFailed = false;
  try {
    embed.addField("overflow", "value");
  } catch (error) {
    countFailed = error instanceof OverflowError;
  }
  assert(countFailed, "超過欄位上限應失敗");
});

Deno.test("Reddit media 判斷與 API 結果會產生資料", async () => {
  assert(Reddit.isMedia("https://example.com/a.JPG?x=1"), "JPG 應視為媒體");
  assert(!Reddit.isMedia("https://example.com/a.html"), "HTML 不應視為媒體");

  const originalFetch = globalThis.fetch;
  globalThis.fetch = () =>
    Promise.resolve(
      new Response(
        JSON.stringify({
          data: {
            children: [{
              data: {
                subreddit: "pics",
                selftext: "body",
                title: "title",
                author: "author",
                permalink: "/r/pics/a",
                author_flair_text_color: "#00ff00",
                url: "https://example.com/a.jpg",
                over_18: false,
                created_utc: 1_700_000_000,
                is_video: false,
                thumbnail: "self",
              },
            }],
          },
        }),
        { status: 200 },
      ),
    );
  try {
    const reddit = new Reddit("pics");
    const data = await reddit.toData(true, true);
    assertEquals(data.title, "title");
    const embed = (await reddit.toEmbed(true, true))[0]!;
    assertEquals(embed.title, "title");
    assertEquals(embed.image?.url, "https://example.com/a.jpg");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("Reddit 沒有符合條件的貼文會拋出 EmptyError", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () =>
    Promise.resolve(
      new Response(
        JSON.stringify({
          data: { children: [] },
        }),
        { status: 200 },
      ),
    );
  try {
    let failed = false;
    try {
      await new Reddit("empty").toData();
    } catch (error) {
      failed = error instanceof EmptyError;
    }
    assert(failed, "空 Reddit 結果應拋出 EmptyError");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

Deno.test("顏色常數與 embed JSON 欄位完整", () => {
  const json = new CCOSVEmbed().setImg("https://x").setThumb("https://y")
    .build()[0]!;
  assertDeepEquals(json.image, { url: "https://x" });
  assertDeepEquals(json.thumbnail, { url: "https://y" });
});
