import { Data2, RootObject } from "../interfaces/reddit.ts";
import { CCOSVEmbed } from "@classes/embed.ts";
import { discordeno } from "@deps";
import { EmptyError } from "@const/errors.ts";
import { EMBED } from "@const/globalLimit.ts";
import { COLORS } from "@const/colors.ts";

export class Reddit {
  private readonly url: string;
  private readonly subreddit: string;
  private result: RootObject | undefined;

  constructor(subreddit: string, sort?: string) {
    this.subreddit = subreddit;
    this.url = `https://reddit.com/r/${subreddit}${
      !sort ? ".json" : "/" + sort + ".json"
    }`;
  }

  private async fetch(): Promise<RootObject> {
    if (!this.result) {
      this.result = await fetch(this.url, {
        headers: { "User-Agent": "CC-OSV-JS/2.0" },
      }).then((r) => {
        if (!r.ok) {
          throw new Error(String(r.status) + ` ${this.subreddit}`);
        }
        return r.json();
      });
    }
    return this.result as RootObject;
  }

  public static isMedia(v: string) {
    const value = v.toLowerCase().split("?")[0] ?? "";
    function ends(str: string): boolean {
      return value.endsWith(str);
    }
    return ends(".jpg") || ends(".png") || ends(".jpeg") || ends(".webp") ||
      ends(".gif");
  }

  async toData(media_only?: boolean, sfw_only?: boolean): Promise<Data2> {
    const r = await this.fetch();
    let candidates = r.data.children;
    if (sfw_only) candidates = candidates.filter((item) => !item.data.over_18);
    if (media_only) {
      candidates = candidates.filter((item) => Reddit.isMedia(item.data.url));
    }
    if (candidates.length < 1) throw new EmptyError("找不到符合條件的貼文。");
    const random = Math.floor(Math.random() * candidates.length);
    return candidates[random]!.data;
  }

  private toRealUTC(reddit_utc: number): number {
    const miss = 13 - String(reddit_utc).length;
    return Number(String(reddit_utc) + "0".repeat(miss));
  }

  async toEmbed(
    media_only?: boolean,
    sfw_only?: boolean,
  ): Promise<discordeno.Camelize<discordeno.DiscordEmbed>[]> {
    const data = await this.toData(media_only, sfw_only);
    const realUTC = this.toRealUTC(data.created_utc);
    const e = new CCOSVEmbed()
      .setTitle(data.title)
      .setTime(realUTC)
      .setColor(data.author_flair_text_color || COLORS.RANDOM)
      .setURL("https://reddit.com" + data.permalink)
      .setFooter(`u/${data.author} - r/${this.subreddit}`);
    if (media_only || Reddit.isMedia(data.url)) {
      e.setImg(data.url);
      return e.build();
    } else if (data.selftext) {
      e.setDesc(data.selftext.slice(0, EMBED.DESCRIPTION - 5) + "...");
    }
    if (data.is_video) {
      e.setDesc(`[Video](${data.url})`)
        .setThumb(data.thumbnail);
    }
    return e.build();
  }
}
