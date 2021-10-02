const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "connectionCreate",
  execute(bot, queue, connection) {
    const embed = new MessageEmbed()
      .setAuthor("音樂已成功添加至播放列。", "https://img.icons8.com/color/2x/cd--v3.gif")
      .addField(`語音頻道`, queue.connection.channel.toString())
      .addField(`指令頻道`, queue.metadata.channel.toString())
      .setColor(queue.guild.me.displayColor || "#00FFFF");
    return queue.metadata.editReply({ embeds: [embed], allowedMentions: { repliedUser: false } }).catch(console.error);
    
  }
};
