import { discordeno } from "@deps";
import { OverflowError } from "@const/errors.ts";
import { EMBED } from "@const/globalLimit.ts";
import { COLORS } from "@const/colors.ts";
import { CCOSVMsgCommand, prefix } from "@classes/command.ts";
import { stripEmoji } from "@utils/text.ts";

const hexToDecimal = (hex: string): number => parseInt(hex, 16);

/** 統一建立 Discord Embed，並在輸出前套用長度限制與文字清理。 */
export class CCOSVEmbed
  implements discordeno.Camelize<discordeno.DiscordEmbed> {
  public title?: string;
  public description?: string;
  public image?: discordeno.EmbedImage;
  public author?: discordeno.EmbedAuthor;
  public fields: discordeno.EmbedField[] = [];
  public thumbnail?: discordeno.EmbedThumbnail;
  public url?: string;
  public footer?: discordeno.EmbedFooter;
  public color: number;
  public timestamp?: string;

  constructor() {
    this.color = COLORS.RANDOM;
  }

  build(): discordeno.Camelize<discordeno.DiscordEmbed>[] {
    return [this.toJSON()];
  }

  setTitle(name: string): this {
    const safeName = stripEmoji(name);
    if (safeName.length > EMBED.TITLE) {
      throw new OverflowError("標題", EMBED.TITLE);
    }
    this.title = safeName;
    return this;
  }

  setFooter(name: string, iconUrl?: string): this {
    this.footer = iconUrl
      ? { text: stripEmoji(name), iconUrl }
      : { text: stripEmoji(name) };
    return this;
  }

  setDesc(desc: string): this {
    const safeDesc = stripEmoji(desc);
    if (safeDesc.length > EMBED.DESCRIPTION) {
      throw new OverflowError("描述", EMBED.DESCRIPTION);
    }
    this.description = safeDesc;
    return this;
  }

  setImg(url: string): this {
    this.image = { url };
    return this;
  }

  setURL(url: string): this {
    this.url = url;
    return this;
  }

  setAuthor(name: string, iconUrl?: string, url?: string): this {
    this.author = {
      name: stripEmoji(name),
      ...(iconUrl ? { iconUrl } : {}),
      ...(url ? { url } : {}),
    };
    return this;
  }

  setColor(color: COLORS | string): this {
    if (color === COLORS.RANDOM) {
      this.color = Math.floor(Math.random() * 0xffffff);
      return this;
    }
    const decimal = typeof color === "string"
      ? hexToDecimal(color.replace("#", ""))
      : color;
    if (!Number.isInteger(decimal) || decimal < 0 || decimal > 0xffffff) {
      throw new RangeError("Embed 顏色必須是有效的十六進位顏色");
    }
    this.color = decimal;
    return this;
  }

  addField(name: string, value: string, inline?: boolean): this {
    const safeName = stripEmoji(name);
    const safeValue = stripEmoji(value);
    if (safeName.length > EMBED.FIELD_NAME) {
      throw new OverflowError("欄位名稱", EMBED.FIELD_NAME);
    }
    if (safeValue.length > EMBED.FIELD_VALUE) {
      throw new OverflowError("欄位內容", EMBED.FIELD_VALUE);
    }
    if (this.fields.length >= EMBED.FIELDS) {
      throw new OverflowError("欄位數量", EMBED.FIELDS);
    }
    this.fields.push({ name: safeName, value: safeValue, inline });
    return this;
  }

  addFields(fields: discordeno.EmbedField[]): this {
    for (const field of fields) {
      this.addField(field.name, field.value, field.inline);
    }
    return this;
  }

  setThumb(url: string): this {
    this.thumbnail = { url };
    return this;
  }

  setTime(date: number | Date): this {
    this.timestamp = (date instanceof Date ? date : new Date(date))
      .toISOString();
    return this;
  }

  toJSON(): discordeno.Camelize<discordeno.DiscordEmbed> {
    return {
      title: this.title,
      description: this.description,
      image: this.image,
      thumbnail: this.thumbnail,
      timestamp: this.timestamp,
      type: "rich",
      author: this.author,
      color: this.color,
      url: this.url,
      footer: this.footer,
      fields: this.fields,
    };
  }

  command(
    command: CCOSVMsgCommand,
  ): discordeno.Camelize<discordeno.DiscordEmbed>[] {
    return this
      .setTitle(`指令：${command.name}`)
      .setDesc(command.description)
      .addField(
        "別名",
        command.aliases.length ? command.aliases.join(", ") : "無",
      )
      .addField("用法", `${prefix}${command.name} ${command.usage ?? ""}`, true)
      .addField(
        "要求權限",
        command.permission?.join(", ") ?? "無",
        true,
      )
      .build();
  }
}
