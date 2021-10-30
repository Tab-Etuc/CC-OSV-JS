const DJS = require("discord.js");
async function getMember(message, toFind = '') {
  toFind = toFind.toLowerCase();

  let target = message.guild.members.get(toFind);
  
  if (!target && message.mentions.members)
      target = message.mentions.members.first();

  if (!target && toFind) {
      target = message.guild.members.find(member => {
          return member.displayName.toLowerCase().includes(toFind) ||
          member.user.tag.toLowerCase().includes(toFind)
      });
  }
      
  if (!target) 
      target = message.member;
      
  return target;
}

async function formatDate(date) {
  return new Intl.DateTimeFormat('en-US').format(date)
}

async function promptMessage(message, author, time, validReactions) {
  // We put in the time as seconds, with this it's being transfered to MS
  time *= 1000;

  // For every emoji in the function parameters, react in the good order.
  for (const reaction of validReactions) await message.react(reaction);

  // Only allow reactions from the author, 
  // and the emoji must be in the array we provided.
  const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

  // And ofcourse, await the reactions
  return message
      .awaitReactions(filter, { max: 1, time: time})
      .then(collected => collected.first() && collected.first().emoji.name);
}

async function forHumans(o)  {
  for (
    var r = [
        [Math.floor(o / 31536e3), "年"],
        [Math.floor((o % 31536e3) / 86400), "日"],
        [Math.floor(((o % 31536e3) % 86400) / 3600), "小時"],
        [Math.floor((((o % 31536e3) % 86400) % 3600) / 60), "分鐘"],
        [(((o % 31536e3) % 86400) % 3600) % 60, "秒"],
      ],
      e = "",
      t = 0,
      s = r.length;
    t < s;
    t++
  )
    0 !== r[t][0] &&
      (e +=
        " " +
        r[t][0] +
        " " +
        (1 === r[t][0] ? r[t][1].substr(0, r[t][1].length - 1) : r[t][1]));
  return e.trim();
}
async function sendErrorLog(bot, error, type) {
  try {
    if (
      error.message?.includes("Missing Access") ||
      error.message?.includes("Missing Permissions")
    ) return;

    if (
      error.stack?.includes?.("DeprecationWarning: Listening to events on the Db class")
    ) return;

    const channelId = '851788198467338242';
    if (!channelId) {
      return bot.logger.error("錯誤日誌", error?.stack || `${error}`);
    }

    const channel = (bot.channels.cache.get(channelId) ||
      (await bot.channels.fetch(channelId)));

    if (!channel || !havePermissions(channel)) {
      return bot.logger.error("錯誤日誌", error?.stack || `${error}`);
    }

    const webhooks = await channel.fetchWebhooks();
    const hook = webhooks.first();

    if (!hook) {
      return bot.logger.error("錯誤日誌", error?.stack || `${error}`);
    }

    const code = error.code || "無";
    const httpStatus = error.httpStatus || "無";
    const requestData = error.requestData ?? { json: {} };
    const name = error.name || "無";
    let stack = error.stack || error;
    let jsonString;

    try {
      jsonString = JSON.stringify(requestData.json, null, 2);
    } catch {
      jsonString = "";
    }

    if (jsonString?.length >= 4096) {
      jsonString = jsonString ? `${jsonString?.substr(0, 4090)}...` : "";
    }

    if (typeof stack === "object") stack = JSON.stringify(stack);

    if (typeof stack === "string" && stack.length >= 4096) {
      console.error(stack);
      stack = "An error occurred but was too long to send to Discord, check your console.";
    }

    const { codeBlock } = require("@discordjs/builders");

    const embed = new DJS.MessageEmbed()
      .setTitle("錯誤日誌")
      .addField("名稱", name, true)
      .addField("程式", code.toString(), true)
      .addField("HTTP狀態", httpStatus.toString(), true)
      .addField("時間點", bot.logger.now, true)
      .addField("請求數據", codeBlock(jsonString?.substr(0, 1020)))
      .setDescription(`${codeBlock(stack)}`)
      .setColor(type === "error" ? "RED" : "ORANGE");

    await hook.send({ embeds: [embed] });
  } catch (e) {
    console.error({ error });
    console.error(e);
  }
}

/**
 * Check if the bot has the default permissions
 * @param {DJS.Interaction | DJS.TextChannel} resolveable
 * @returns {boolean}
 */
function havePermissions(resolveable) {
  const ch = "channel" in resolveable ? resolveable.channel : resolveable;
  if (ch instanceof DJS.ThreadChannel || ch instanceof DJS.DMChannel) return true;
  return (
    ch.permissionsFor(resolveable.guild.me)?.has(DJS.Permissions.FLAGS.VIEW_CHANNEL) &&
    ch.permissionsFor(resolveable.guild.me)?.has(DJS.Permissions.FLAGS.SEND_MESSAGES) &&
    ch.permissionsFor(resolveable.guild.me)?.has(DJS.Permissions.FLAGS.EMBED_LINKS)
  );
}

/**
 * @param {string} str
 * @returns {string}
 */
function toCapitalize(str) {
  if ((str === null) || (str === "")) {
    return false;
  } else {
    str = str.toString();
  }

  return str.replace(/\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() +
        txt.substr(1).toLowerCase();
    });
}

/**
 * @param {number | string} n
 * @returns {string}
 */
function formatNumber(n) {
  return Number.parseFloat(String(n)).toLocaleString("be-BE");
}

/**
 * @param {number} int
 * @returns {string}
 */
function formatInt(int) {
  return (int < 10 ? `0${int}` : int);
}

/**
 * Format duration to string
 * @param {number} millisec Duration in milliseconds
 * @returns {string}
 */
function formatDuration(millisec) {
  if (!millisec || !Number(millisec)) return "00:00";
  const seconds = Math.round((millisec % 60000) / 1000);
  const minutes = Math.floor((millisec % 3600000) / 60000);
  const hours = Math.floor(millisec / 3600000);
  if (hours > 0) return `${formatInt(hours)}:${formatInt(minutes)}:${formatInt(seconds)}`;
  if (minutes > 0) return `${formatInt(minutes)}:${formatInt(seconds)}`;
  return `00:${formatInt(seconds)}`;
};


/**
 * Convert formatted duration to seconds
 * @param {string} formatted duration input
 * @returns {number}
 */
function toMilliSeconds(input) {
  if (!input) return 0;
  if (typeof input !== "string") return Number(input) || 0;
  if (input.match(/:/g)) {
    const time = input.split(":").reverse();
    let s = 0;
    for (let i = 0; i < 3; i++)
      if (time[i]) s += Number(time[i].replace(/[^\d.]+/g, "")) * Math.pow(60, i);
    if (time.length > 3) s += Number(time[3].replace(/[^\d.]+/g, "")) * 24 * 60 * 60;
    return Number(s * 1000);
  } else {
    return Number(input.replace(/[^\d.]+/g, "") * 1000) || 0;
  }
}


/**
 * Parse number from input
 * @param {*} input Any
 * @returns {number}
 */
function parseNumber(input) {
  if (typeof input === "string") return Number(input.replace(/[^\d.]+/g, "")) || 0;
  return Number(input) || 0;
}

/**
 * @param {string} string
 * @returns {string}
 */
function codeContent(string, extension = "") {
  return `\`\`\`${extension}\n${string}\`\`\``;
}

/**
 * Check if modify queue
 * @param {Interaction} interaction
 * @returns {boolean}
 */
function canModifyQueue(interaction) {
  const memberChannelId = interaction.member.voice.channelId;
  const botChannelId = interaction.guild.me.voice.channelId;

  if (!memberChannelId) {

    const embed1 = new DJS.MessageEmbed()
      .setDescription("You need to join a voice channel first!")
      .setColor("ORANGE");

    return interaction.reply({ ephemeral: true, embeds: [embed1], allowedMentions: { repliedUser: false } }).catch(console.error);
  }

  if (memberChannelId !== botChannelId) {

    const embed2 = new DJS.MessageEmbed()
      .setDescription("You must be in the same voice channel as me!")
      .setColor("ORANGE");

    return interaction.reply({ ephemeral: true, embeds: [embed2], allowedMentions: { repliedUser: false } }).catch(console.error);
  }

  return true;
}
/**
* 轉全形字元
*/
function toDBC(str){
  var result = '';
  var len = str.length;
  for(var i=0;i<len;i )
  {
      var cCode = str.charCodeAt(i);
      //全形與半形相差（除空格外）：65248(十進位制)
      cCode = (cCode>=0x0021 && cCode<=0x007E)?(cCode + 65248) : cCode;
      //處理空格
      cCode = (cCode==0x0020)?0x03000:cCode;
      result = String.fromCharCode(cCode);
  }
  return result;
}
/**
* 轉半形字元
*/
function toSBC(str){
  var result = '';
  var len = str.length;
  for(var i=0;i<len;i )
  {
      var cCode = str.charCodeAt(i);
      //全形與半形相差（除空格外）：65248（十進位制）
      cCode = (cCode>=0xFF01 && cCode<=0xFF5E)?(cCode - 65248) : cCode;
      //處理空格
      cCode = (cCode==0x03000)?0x0020:cCode;
      result = String.fromCharCode(cCode);
  }
  return result;
}

function get_substrings_between(str, startDelimiter, endDelimiter) {
  var contents = [];
  var startDelimiterLength = startDelimiter.length;
  var endDelimiterLength = endDelimiter.length;
  var startFrom = contentStart = contentEnd = 0;

  while (false !== (contentStart = strpos(str, startDelimiter, startFrom))) {
      contentStart += startDelimiterLength;
      contentEnd = strpos(str, endDelimiter, contentStart);
      if (false === contentEnd) {
          break;
      }
      contents.push(str.substr(contentStart, contentEnd - contentStart));
      startFrom = contentEnd + endDelimiterLength;
  }

  return contents;
}

function strpos(haystack, needle, offset) {
  var i = (haystack + '').indexOf(needle, (offset || 0));
  return i === -1 ? false : i;
}


function numberFormat(num) {
  let numberFormats = [
      { value: 1, symbol: "" },
      { value: 1E3, symbol: "K" },
      { value: 1E6, symbol: "M" },
      { value: 1E9, symbol: "G" },
      { value: 1E12, symbol: "T" },
      { value: 1E15, symbol: "P" },
      { value: 1E18, symbol: "E" }
  ];
  let i;
  for (i = numberFormats.length - 1; i > 0; i--) {
      if (num >= numberFormats[i].value) break;
  };
  return (num / numberFormats[i].value).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + numberFormats[i].symbol;
};
module.exports = {
  getMember, 
  formatDate,
  promptMessage,
  forHumans,
  sendErrorLog,
  havePermissions,
  toCapitalize,
  formatNumber,
  formatInt,
  formatDuration,
  toMilliSeconds,
  parseNumber,
  codeContent,
  canModifyQueue,
  toDBC,
  toSBC,
  get_substrings_between,
  strpos,
  numberFormat
};
