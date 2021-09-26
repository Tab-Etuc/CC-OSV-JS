const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "trackStart",
  execute(bot, queue, track) {
    if (!bot.utils.havePermissions(queue.metadata.channel)) return;

    const embed = new MessageEmbed()
      .setTitle("現正播放")
      .setColor(queue.guild.me.displayColor || "#00FFFF")
      .setDescription(`[${track.title}](${track.url}) 由 ~ [${track.requestedBy.toString()}]`);

    return queue.metadata.channel.send({ embeds: [embed] });
  }
};
