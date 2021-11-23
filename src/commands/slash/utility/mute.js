const ms = require('ms')
const { Permissions } = require('discord.js')

module.exports = {
  name: 'mute',
  description: '使一位對象失去發言權限。',
  category: '實用',
  options: [
    {
      name: '對象',
      type: 'USER',
      description: '您欲於禁言的對象',
      required: true
    },
    {
      name: '時長',
      type: 'INTEGER',
      description: '您欲禁言的時長。',
      required: true
    }
  ],
  async execute (bot, interaction) {
    let member = interaction.options.getUser('對象', false)
    let mutetime = interaction.options.getInteger('時長', false)

    let guild = bot.guilds.cache.get(interaction.guildId)
    let toMute = guild.members.cache.get(member.id)

    if (toMute.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
      return interaction.reply('對象權限過高，無法執行此動作。')
    let muterole = guild.roles.cache.find(muterole => muterole.name === 'muted')

    if (!muterole) {
      console.log('888')
      try {
        muterole = await guild.roles.create({
          name: 'muted',
          color: '#000000',
          permissions: [],

          reason: `${interaction.member.user.username} 使用了 禁言 指令。`
        })
        interaction.guild.channels.cache.forEach(async channel => {
          await channel.overwritePermissions(muterole, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          })
        })
      } catch (e) {
        console.log(e.stack)
      }
    }

    await toMute.roles.add(muterole)
    interaction.reply(`<@${toMute.id}> 已被禁言: ${bot.ms(mutetime)}`)

    setTimeout(function () {
      toMute.roles.remove(muterole)
      interaction.followUp(`<@${toMute.id}> 已解除禁言！`)
    }, mutetime)
  }
}
