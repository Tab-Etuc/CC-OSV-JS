const {
  MessageActionRow,
  MessageSelectMenu,
  MessageButton,
  MessageEmbed
} = require('discord.js')

module.exports = {
  name: 'help',
  description: '顯示CC-OSV之指令幫助頁面。',
  category: '實用',
  subCommands: [
    '<指令>**\n顯示該指令之幫助頁面。\n<類別>**\n顯示該類別的所有指令。'
  ],
  options: [
    {
      name: '指令',
      type: 'STRING',
      description: '您欲尋找之指令。',
      required: false
    },
    {
      name: '類別',
      type: 'STRING',
      description: '您欲尋找之類別。',
      required: false,
      choices: [
        {
          name: '音樂',
          value: 'music'
        },
        {
          name: '樂趣',
          value: 'fun'
        },
        {
          name: '實用',
          value: 'utility'
        }
      ]
    }
  ],
  async execute (bot, interaction) {
    await interaction.deferReply()
    
    const arg = interaction.options.getString('指令', false)
    const arg_2 = interaction.options.getString('類別', false)

    const timeout = 120000
    var timeForStart = Date.now()

    const firstEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setAuthor('CC-OSV　幫助頁面', bot.user.displayAvatarURL())
      .setTitle('此為前導介面')
      .setDescription(
        `總計指令數：**${bot.slashCommands.size}**\n__***請點擊下方指令欄，選取指令類別***__\n\n備註：輸入指令時，請善用**Tab**鍵\n\n\n上次更新內容：\n\n\`-\` 🟢 新增 音樂機器人系統 🎶\n\`-\` 🟢 新增 伐木、挖礦、釣魚、農耕等賺錢管道\n\`-\` 🟢 新增 按鈕式計算機、井字遊戲...`
      )
      .setThumbnail(bot.user.displayAvatarURL())
      .setTimestamp()
      .setFooter(
        interaction.user?.tag,
        interaction.user?.displayAvatarURL({ dynamic: true })
      )
    const firstCategoryMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId('help_select_menu')
        .setPlaceholder('請選擇一個類別')
        .addOptions([
          {
            label: '樂趣類別',
            description: '關於樂趣類別的相關指令',
            value: 'help_fun_option',
            emoji: '<:__:886488876200394802>'
          },
          {
            label: '實用類別',
            description: '關於實用類別的相關指令',
            value: 'help_utility_option',
            emoji: '<:__:853189224865464320>'
          },
          {
            label: '音樂類別',
            description: '關於音樂類別的相關指令',
            value: 'help_music_option',
            emoji: '<a:cdv3:888730337109233674>'
          }
        ])
    )
    const firstButton = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('help_前導介面')
        .setLabel('前導介面')
        .setStyle('PRIMARY')
        .setDisabled(true),
      new MessageButton()
        .setCustomId('help_教學')
        .setLabel('教學')
        .setStyle('PRIMARY')
    )
    const Button = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId('help_前導介面')
        .setLabel('前導介面')
        .setStyle('PRIMARY'),
      new MessageButton()
        .setCustomId('help_教學')
        .setLabel('教學')
        .setStyle('PRIMARY')
    )
    const musicCategoryEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setAuthor('CC-OSV　幫助頁面', bot.user.displayAvatarURL())
      .setTitle('音樂類別：')
      .setDescription(
        '\n>>> `/back` - 返回上一首歌。\n`/clear` - 清除當前播放列。(註：不會清除當前播放之曲目)\n`/jump` - 跳到播放列中的某一首歌。\n`/loop` - 顯示當前設置之重複播放模式。\n`/lyrics` - 獲取歌曲的歌詞。\n`/move` - 將所選歌曲移動到播放列中您所提供的位置。\n`/mute` - 將音樂靜音。\n`/pause` - 暫停當前播放的歌曲。\n`/play` - 從(欲搜尋之)歌曲名稱或連結播放歌曲或播放列表。\n`/queue` - 顯示播放列。\n`/remove` - 從播放列中移除歌曲。\n`/replay` - 重播當前的歌曲。\n`/resume` - 取消當前暫停的歌曲。\n`/shuffle` - 將播放列中的播放順序重新排列。\n`/skip` - 跳過當前播放的歌曲。\n`/stop` - 停止播放歌曲。\n`/unmute` - 解除歌曲靜音。\n`/volume` - 顯示當前的音量。\n`/youtube` - 和伺服器成員一起觀看YouTube影片。'
      )
      .setTimestamp()
      .setFooter(
        interaction.user?.tag,
        interaction.user?.displayAvatarURL({ dynamic: true })
      )
    const musicCategoryMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId('help_select_menu')
        .setPlaceholder('音樂類別')
        .addOptions([
          {
            label: '樂趣類別',
            description: '關於樂趣類別的相關指令',
            value: 'help_fun_option',
            emoji: '<:__:886488876200394802>'
          },
          {
            label: '實用類別',
            description: '關於實用類別的相關指令',
            value: 'help_utility_option',
            emoji: '<:__:853189224865464320>'
          },
          {
            label: '音樂類別',
            description: '關於音樂類別的相關指令',
            value: 'help_music_option',
            emoji: '<a:cdv3:888730337109233674>'
          }
        ])
    )
    const funCategoryEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setAuthor('CC-OSV　幫助頁面', bot.user.displayAvatarURL())
      .setTitle('樂趣類別：')
      .setDescription('\n>>> `/ttt` - 遊玩一局井字遊戲。')
      .setTimestamp()
      .setFooter(
        interaction.user?.tag,
        interaction.user?.displayAvatarURL({ dynamic: true })
      )
    const funCategoryMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId('help_select_menu')
        .setPlaceholder('樂趣類別')
        .addOptions([
          {
            label: '樂趣類別',
            description: '關於樂趣類別的相關指令',
            value: 'help_fun_option',
            emoji: '<:__:886488876200394802>'
          },
          {
            label: '實用類別',
            description: '關於實用類別的相關指令',
            value: 'help_utility_option',
            emoji: '<:__:853189224865464320>'
          },
          {
            label: '音樂類別',
            description: '關於音樂類別的相關指令',
            value: 'help_music_option',
            emoji: '<a:cdv3:888730337109233674>'
          }
        ])
    )
    const utilityCategoryEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setAuthor('CC-OSV　幫助頁面', bot.user.displayAvatarURL())
      .setTitle('實用類別：')
      .setDescription(
        '\n>>> `/botinfo` - CC-OSV資訊。\n`/calculator` - 按鈕計算機。\n `help` - 幫助頁面\n`/ping` - 顯示bot延遲。\n`purge` - 清除指定數量訊息。\n`/uptime` - 展示bot上線多久了。'
      )
      .setTimestamp()
      .setFooter(
        interaction.user?.tag,
        interaction.user?.displayAvatarURL({ dynamic: true })
      )
    const utilityCategoryMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId('help_select_menu')
        .setPlaceholder('實用類別')
        .addOptions([
          {
            label: '樂趣類別',
            description: '關於樂趣類別的相關指令',
            value: 'help_fun_option',
            emoji: '<:__:886488876200394802>'
          },
          {
            label: '實用類別',
            description: '關於實用類別的相關指令',
            value: 'help_utility_option',
            emoji: '<:__:853189224865464320>'
          },
          {
            label: '音樂類別',
            description: '關於音樂類別的相關指令',
            value: 'help_music_option',
            emoji: '<a:cdv3:888730337109233674>'
          }
        ])
    )

    // 查詢單一指令介紹
    if (arg) {
      const cmd = bot.slashCommands.get(arg)
      if (!cmd)
        return bot.say.warnMessage(interaction, `沒有這個指令： \`${arg}\`.`)

      const cmdUsage = cmd.usage
        ? `\/${cmd.name} ${cmd.usage}`
        : `\/${cmd.name}`

      const embed = bot.say
        .rootEmbed(interaction)
        .setAuthor(
          `${cmd.category} 指令： ${cmd.name}`,
          bot.user.displayAvatarURL()
        )
        .addField(`${cmdUsage}`, `${cmd.description ?? '尚未註明，ㄏㄏ'}`)
        .setFooter('提示： [] 為非必填 • <> 為必填 • | 為擇一')

      let subcmd = cmd.subCommands
      if (subcmd && subcmd.length >= 1) {
        for (let s = 0; s < subcmd.length; s++) {
          embed.addField('** **', `**\/${cmd.name} ${subcmd[s]}`)
        }
      }
      return interaction.editReply({
        ephemeral: true,
        embeds: [embed],
        allowedMentions: { repliedUser: false }
      })
    }


    // 查詢類別介紹
    else if (arg_2) {
      if (arg_2 === 'music') {
        return interaction.editReply({
          ephemeral: false,
          embeds: [musicCategoryEmbed],
          components: [Button, musicCategoryMenu],
          allowedMentions: { repliedUser: false }
        })
      } else if (arg_2 === 'fun') {
        return interaction.editReply({
          ephemeral: true,
          embeds: [funCategoryEmbed],
          components: [Button, funCategoryMenu],
          allowedMentions: { repliedUser: false }
        })
      } else if (arg_2 === 'utility') {
        return interaction.editReply({
          ephemeral: true,
          embeds: [utilityCategoryEmbed],
          components: [Button, utilityCategoryMenu],
          allowedMentions: { repliedUser: false }
        })
      }
    }

    // 前導介面
    await interaction.editReply({
      embeds: [firstEmbed],
      components: [firstButton, firstCategoryMenu],
      ephemeral: false
    })

    // 接收選單事件
    bot.on('interactionCreate', async i => {
      if (!i.isSelectMenu()) return
      if (Date.now() - timeForStart >= timeout) {
        const row = new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId('help_select_menu')
            .setPlaceholder('指令已超時')
            .setDisabled(true)
            .addOptions([
              {
                label: '樂趣類別',
                description: '關於樂趣類別的相關指令',
                value: 'help_fun_option',
                emoji: '<:__:886488876200394802>'
              },
              {
                label: '實用類別',
                description: '關於實用類別的相關指令',
                value: 'help_utility_option',
                emoji: '<:__:853189224865464320>'
              },
              {
                label: '音樂類別',
                description: '關於音樂類別的相關指令',
                value: 'help_music_option',
                emoji: '<a:cdv3:888730337109233674>'
              }
            ])
        )
        const row_button = new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId('help_前導介面')
            .setLabel('前導介面')
            .setStyle('SECONDARY')
            .setDisabled(true),
          new MessageButton()
            .setCustomId('help_教學')
            .setLabel('教學')
            .setStyle('SECONDARY')
            .setDisabled(true)
        )
        await i.update({ components: [row_button, row] })
      }
      else if (i.customId === 'help_select_menu') {
        if (i.values[0] === 'help_fun_option') {
          const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setAuthor('CC-OSV　幫助頁面', bot.user.displayAvatarURL())
            .setTitle('樂趣類別：')
            .setDescription('\n>>> `/ttt` - 遊玩一局井字遊戲。')
            .setTimestamp()
            .setFooter(i.user?.tag, i.user?.displayAvatarURL({ dynamic: true }))

          await i.update({
            embeds: [embed],
            components: [Button, funCategoryMenu]
          })
        } else if (i.values[0] === 'help_utility_option') {
          const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setAuthor('CC-OSV　幫助頁面', bot.user.displayAvatarURL())
            .setTitle('實用類別：')
            .setDescription(
              '\n>>> `/botinfo` - 123\n`/計算機` - 按鈕計算機。\n `help` - 幫助頁面\n`/ping` - 顯示bot延遲。\n`purge` - 清除指定數量訊息。\n`/uptime` - 顯示bot上線時間。'
            )
            .setTimestamp()
            .setFooter(i.user?.tag, i.user?.displayAvatarURL({ dynamic: true }))

          await i.update({
            embeds: [embed],
            components: [Button, utilityCategoryMenu]
          })
        } else if (i.values[0] === 'help_music_option') {
          const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setAuthor('CC-OSV　幫助頁面', bot.user.displayAvatarURL())
            .setTitle('音樂類別：')
            .setDescription(
              '\n>>> `/back` - 返回上一首歌。\n`/clear` - 清除當前播放列。(註：不會清除當前播放之曲目)\n`/jump` - 跳到播放列中的某一首歌。\n`/loop` - 顯示當前設置之重複播放模式。\n`/lyrics` - 獲取歌曲的歌詞。\n`/move` - 將所選歌曲移動到播放列中您所提供的位置。\n`/mute` - 將音樂靜音。\n`/pause` - 暫停當前播放的歌曲。\n`/play` - 從(欲搜尋之)歌曲名稱或連結播放歌曲或播放列表。\n`/queue` - 顯示播放列。\n`/remove` - 從播放列中移除歌曲。\n`/replay` - 重播當前的歌曲。\n`/resume` - 取消當前暫停的歌曲。\n`/shuffle` - 將播放列中的播放順序重新排列。\n`/skip` - 跳過當前播放的歌曲。\n`/stop` - 停止播放歌曲。\n`/unmute` - 解除歌曲靜音。\n`/volume` - 顯示當前的音量。\n`/youtube` - 和伺服器成員一起觀看YouTube影片。'
            )
            .setTimestamp()
            .setFooter(i.user?.tag, i.user?.displayAvatarURL({ dynamic: true }))

          await i.update({
            embeds: [embed],
            components: [Button, musicCategoryMenu]
          })
        }
      }
    })

    // 接收按鈕事件
    bot.on('interactionCreate', async b => {
      if (!b.isButton()) return
      if (Date.now() - timeForStart >= timeout) {
        const row = new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId('help_select_menu')
            .setPlaceholder('指令已超時！')
            .setDisabled(true)
            .addOptions([
              {
                label: '樂趣類別',
                description: '關於樂趣類別的相關指令',
                value: 'help_fun_option',
                emoji: '<:__:886488876200394802>'
              },
              {
                label: '實用類別',
                description: '關於實用類別的相關指令',
                value: 'help_utility_option',
                emoji: '<:__:853189224865464320>'
              },
              {
                label: '音樂類別',
                description: '關於音樂類別的相關指令',
                value: 'help_music_option',
                emoji: '<a:cdv3:888730337109233674>'
              }
            ])
        )
        const row_button = new MessageActionRow().addComponents(
          new MessageButton()
            .setCustomId('help_前導介面')
            .setLabel('前導介面')
            .setStyle('PRIMARY')
            .setDisabled(true),
          new MessageButton()
            .setCustomId('help_教學')
            .setLabel('教學')
            .setStyle('PRIMARY')
            .setDisabled(true)
        )
        await b.update({
          components: [row_button, row],
          ephemeral: false
        })
      }
      else if (b.customId === 'help_前導介面') {
        const embed = new MessageEmbed()
          .setColor('#0099ff')
          .setAuthor('CC-OSV　幫助頁面', bot.user.displayAvatarURL())
          .setTitle('此為前導介面')
          .setDescription(
            `總計指令數：**${bot.slashCommands.size}**\n__***請點擊下方指令欄，選取指令類別***__\n\n備註：輸入指令時，請善用**Tab**鍵\n\n\n上次更新內容：\n\n\`-\` 🟢 新增 音樂機器人系統 🎶\n\`-\` 🟢 新增 伐木、挖礦、釣魚、農耕等賺錢管道\n\`-\` 🟢 新增 按鈕式計算機、井字遊戲...`
          )
          .setThumbnail(bot.user.displayAvatarURL())
          .setTimestamp()
          .setFooter(b.user?.tag, b.user?.displayAvatarURL({ dynamic: true }))

        await b.update({
          embeds: [embed],
          components: [firstButton, firstCategoryMenu],
          ephemeral: false
        })
      }
    })
  }
}
