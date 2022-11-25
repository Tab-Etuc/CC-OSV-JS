import { discordeno } from "@deps";
import { OverflowError } from "@const/errors.ts";
import { EMBED } from "@const/globalLimit.ts";
import { COLORS } from "@const/colors.ts";
import { CCOSVMsgCommand, prefix } from "@classes/command.ts";

const hexToDecimal = (hex: string) => parseInt(hex, 16);

export class CCOSVEmbed implements discordeno.DiscordEmbed {
  public title?: string | undefined;
  public description?: string | undefined;
  public image?: discordeno.DiscordEmbedImage | undefined;
  public author?: discordeno.DiscordEmbedAuthor | undefined;
  public fields?: discordeno.DiscordEmbedField[] | undefined;
  public thumbnail?: discordeno.DiscordEmbedThumbnail | undefined;
  public url?: string | undefined;
  public footer?: discordeno.DiscordEmbedFooter | undefined;
  public color: number;
  public timestamp: string;

  constructor() {
    this.timestamp = new Date().toISOString();
    this.fields = [];
    this.color = COLORS.RANDOM;
    return this;
  }

  build(): discordeno.Embed[] {
    return [this.toJSON()];
  }

  setTitle(name: string): this {
    if (name.length > EMBED.TITLE) {
      throw new OverflowError("Title", EMBED.TITLE);
    }
    this.title = name;
    return this;
  }

  setFooter(name: string, iconURL?: string): this {
    this.footer = { text: name, icon_url: iconURL };
    return this;
  }

  setDesc(desc: string): this {
    if (desc.length > EMBED.DESCRIPTION) {
      throw new OverflowError("Description", EMBED.DESCRIPTION);
    }
    this.description = desc;
    return this;
  }

  setImg(url: string): this {
    this.image = { url: url };
    return this;
  }

  setURL(url: string): this {
    this.url = url;
    return this;
  }

  setAuthor(name: string, iconURL?: string, url?: string): this {
    this.author = { name: name, icon_url: iconURL, url: url };
    return this;
  }

  setColor(color: COLORS | string): this {
    if (color == COLORS.RANDOM) {
      color = Math.floor(Math.random() * 16777214);
    }
    if (typeof color == "string") {
      color = hexToDecimal(color.replace("#", ""));
    }
    this.color = color;
    return this;
  }

  addField(name: string, value: string, inline?: boolean): this {
    if (name.length > EMBED.FIELD_NAME) {
      throw new OverflowError("Field name", EMBED.FIELD_NAME);
    } else if (value.length > EMBED.FIELD_VALUE) {
      throw new OverflowError("Field value", EMBED.FIELD_VALUE);
    }
    this.fields!.push({ name: name, value: value, inline: inline });
    return this;
  }

  addFields(fields: discordeno.DiscordEmbedField[]): this {
    if (fields.length > EMBED.FIELDS) {
      throw new OverflowError("Fields", EMBED.FIELDS);
    }
    for (const field of fields) {
      this.addField(field.name, field.value, field.inline);
    }
    return this;
  }

  setThumb(url: string): this {
    this.thumbnail = { url: url };
    return this;
  }

  setTime(date: number | Date): this {
    if (typeof date == "number") {
      date = new Date(date);
    }
    this.timestamp = date.toISOString();
    return this;
  }

  toJSON(): discordeno.Embed {
    return {
      title: this.title,
      description: this.description,
      image: this.image,
      thumbnail: this.thumbnail,
      timestamp: Date.parse(this.timestamp) || undefined,
      type: "rich",
      author: {
        name: this.author?.name as string,
        // for some reasons, discordeno.Embed wants iconUrl and not icon_url
        iconUrl: this.author?.icon_url,
      },
      color: this.color == COLORS.RANDOM
        ? Math.floor(Math.random() * 16777214)
        : this.color,
      url: this.url,
      footer: this.footer,
      fields: this.fields,
    };
  }

  command(command: CCOSVMsgCommand): discordeno.Embed[] {
    function bool(boo: boolean | undefined): string {
      return boo ? "Yes" : "No";
    }
    return this
      .setTitle(`Command: ${command.name}`)
      .setDesc(command.description)
      .addField(
        "Aliases",
        !command.aliases.length ? "No aliases" : command.aliases.join(", "),
      )
      .addField("Usage", `${prefix + command.name} ${command.usage}`, true)
      .addField("Is owner?", bool(command.owner), true)
      .addField(
        "Permissions required",
        command.permission
          ? command.permission.join(", ")
          : "No permission required",
        true,
      )
      .build();
  }
}
