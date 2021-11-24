const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  MessageButton
} = require('discord.js')
module.exports = {
  name: 'embed',
  description: '簡單地創建一個Embed訊息。',
  category: '實用',
  async execute (bot, interaction) {
    await interaction.deferReply()

    try {
      const done = new MessageButton()
        .setLabel('完畢')
        .setStyle('SUCCESS')
        .setCustomId('setDone')

      const reject = new MessageButton()
        .setLabel('取消/刪除')
        .setStyle('DANGER')
        .setCustomId('setDelete')

      let name = [
        'Message',
        'Title',
        'Description',
        'URL',
        'Color',
        'Image',
        'Thumbnail',
        'Footer'
      ]
      let desc = [
        '獨立於 Embed 之外的一般訊息',
        'Embed 的標題',
        'Embed 的內容',
        'Embed 標題的超連結',
        'Embed 的顏色',
        'Embed 的圖片',
        'Embed 的縮略圖',
        'Embed 的頁腳'
      ]
      let value = [
        'setContent',
        'setTitle',
        'setDescription',
        'setURL',
        'setColor',
        'setImage',
        'setThumbnail',
        'setFooter'
      ]

      let menuOptions = []

      for (let i = 0; i < name.length; i++) {
        let dataopt = {
          label: name[i],
          description: desc[i],
          value: value[i]
        }

        menuOptions.push(dataopt)
      }

      let slct = new MessageSelectMenu()
        .setMaxValues(1)
        .setCustomId('embed-creator')
        .setPlaceholder('Embed 設定選項')
        .addOptions([menuOptions])

      const row = new MessageActionRow().addComponents([done, reject])

      const row2 = new MessageActionRow().addComponents([slct])

      const embed = new MessageEmbed()
        .setTitle('Embed 創建工具')
        .setDescription(
          '從選擇菜單中調整 ***設定*** Embed 創建工具 將為您創建一則 Embed 訊息\n\n這是一則已完成的 Embed。'
        )
        .setImage(
          'https://media.discordapp.net/attachments/867344516600037396/879238983492710450/unknown.png'
        )
        .setColor('#075FFF')
        .setFooter('CC-OSV')

      interaction.editReply({ embeds: [embed], components: [row2, row] })

      const emb = new MessageEmbed().setFooter('CC-OSV').setColor('#2F3136')

      interaction.channel
        .send({ content: '***預覽***', embeds: [emb] })
        .then(async a => {
          let lel = await interaction.fetchReply()
          let e = await interaction.fetchReply()
          let membed = await interaction.channel.messages.fetch(a.id)

          let filter = m => m.user.id === interaction.user.id
          let collector = e.createMessageComponentCollector({
            filter,
            type: 'SELECT_MENU',
            time: 600000
          })

          collector.on('collect', async button => {
            if (button.customId && button.customId === 'setDelete') {
              button.reply({ content: '刪除中...', ephemeral: true })

              membed.delete()
              e.delete()
              interaction.delete()
            } else if (button.customId && button.customId === 'setDone') {
              button.reply({ content: '完畢 👍', ephemeral: true })

              interaction.channel.send({
                content: membed.content,
                embeds: [membed.embeds[0]]
              })
              membed.delete()
              e.delete()
            } else if (button.values[0] === 'setContent') {
              button.reply({
                content: '請輸入您想顯示的「獨立於 Embed 之外的一般訊息」。',
                ephemeral: true
              })
              let filter = m => interaction.user.id === m.author.id
              let titleclr = button.channel.createMessageCollector({
                filter,
                time: 30000,
                max: 1
              })

              titleclr.on('collect', async m => {
                const url = membed.embeds[0].image
                  ? membed.embeds[0].image.url
                  : ''

                let msg = new MessageEmbed()
                  .setTitle(membed.embeds[0].title || '')
                  .setDescription(membed.embeds[0].description || '')
                  .setColor(membed.embeds[0].color || '#36393F')
                  .setFooter(membed.embeds[0].footer.text || '')
                  .setImage(url)
                  .setURL(membed.embeds[0].url || '')
                  .setThumbnail(
                    membed.embeds[0].thumbnail
                      ? membed.embeds[0].thumbnail.url
                      : ''
                  )
                titleclr.stop()
                m.delete()

                membed.edit({ content: m.content, embeds: [msg] })
              })
            } else if (button.values[0] === 'setThumbnail') {
              button.reply({
                content:
                  '請輸入您想顯示的「Embed 的縮略圖（右上角的小圖片）」。',
                ephemeral: true
              })
              let filter = m => interaction.user.id === m.author.id
              let titleclr = button.channel.createMessageCollector({
                filter,
                time: 30000,
                max: 1
              })

              titleclr.on('collect', async m => {
                const url = membed.embeds[0].image
                  ? membed.embeds[0].image.url
                  : ''

                let isthumb =
                  m.content.match(
                    /^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim
                  ) != null ||
                  m.attachments.first().url ||
                  ''
                if (!isthumb)
                  return interaction.reply(
                    '這不是一個可使用的圖像連結。請嘗試重新輸入。'
                  )

                let msg = new MessageEmbed()
                  .setTitle(membed.embeds[0].title || '')
                  .setDescription(membed.embeds[0].description || '')
                  .setColor(membed.embeds[0].color || '#2F3136')
                  .setURL(membed.embeds[0].url || '')
                  .setFooter(membed.embeds[0].footer.text || '')
                  .setImage(url)
                  .setThumbnail(m.content || m.attachments.first().url || '')
                titleclr.stop()
                m.delete()

                membed.edit({ content: membed.content, embeds: [msg] })
              })
            } else if (button.values[0] === 'setColor') {
              button.reply({
                content: '請輸入您想顯示的「Embed 的顏色」。',
                ephemeral: true
              })
              let filter = m => interaction.user.id === m.author.id
              let titleclr = button.channel.createMessageCollector({
                filter,
                time: 30000
              })

              titleclr.on('collect', async m => {
                if (/^#[0-9A-F]{6}$/i.test(m.content)) {
                  const url = membed.embeds[0].image
                    ? membed.embeds[0].image.url
                    : ''

                  let msg = new MessageEmbed()
                    .setTitle(membed.embeds[0].title || '')
                    .setDescription(membed.embeds[0].description || '')
                    .setColor(`${m.content}`)
                    .setURL(membed.embeds[0].url || '')
                    .setFooter(membed.embeds[0].footer.text || '')
                    .setImage(url)
                    .setThumbnail(
                      membed.embeds[0].thumbnail
                        ? membed.embeds[0].thumbnail.url
                        : ''
                    )

                  m.delete()
                  titleclr.stop()
                  membed.edit({ content: membed.content, embeds: [msg] })
                } else {
                  interaction.reply(
                    '請給我一個有效的十六進制代碼（Hex code）。'
                  )
                }
              })
            } else if (button.values[0] === 'setURL') {
              button.reply({
                content: '請輸入您想顯示的「Embed 標題的超連結」。',
                ephemeral: true
              })
              let filter = m => interaction.user.id === m.author.id
              let titleclr = button.channel.createMessageCollector({
                filter,
                time: 30000,
                max: 1
              })

              titleclr.on('collect', async m => {
                const url = membed.embeds[0].image
                  ? membed.embeds[0].image.url
                  : ''
                let msg = new MessageEmbed()
                  .setTitle(membed.embeds[0].title || '')
                  .setURL(m.content)
                  .setDescription(membed.embeds[0].description || '')
                  .setColor(membed.embeds[0].color || '#2F3136')
                  .setImage(url || '')
                  .setFooter(membed.embeds[0].footer.text || '')
                  .setThumbnail(
                    membed.embeds[0].thumbnail
                      ? membed.embeds[0].thumbnail.url
                      : ''
                  )

                m.delete()
                titleclr.stop()
                membed.edit({ content: membed.content, embeds: [msg] })
              })
            } else if (button.values[0] === 'setImage') {
              button.reply({
                content: '請輸入您想顯示的「Embed 的圖片」。',
                ephemeral: true
              })
              let filter = m => interaction.user.id === m.author.id
              let titleclr = button.channel.createMessageCollector({
                filter,
                time: 30000,
                max: 1
              })

              titleclr.on('collect', async m => {
                let isthumb =
                  m.content.match(
                    /^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim
                  ) != null ||
                  m.attachments.first().url ||
                  ''
                if (!isthumb)
                  return interaction.reply(
                    '這不是一個有效的連結。請嘗試重新輸入。'
                  )

                let msg = new MessageEmbed()
                  .setTitle(membed.embeds[0].title || '')
                  .setDescription(membed.embeds[0].description || '')
                  .setColor(membed.embeds[0].color || '#2F3136')
                  .setFooter(membed.embeds[0].footer.text || '')
                  .setImage(m.content || m.attachments.first().url)
                  .setURL(membed.embeds[0].url)
                  .setThumbnail(
                    membed.embeds[0].thumbnail
                      ? membed.embeds[0].thumbnail.url
                      : ''
                  )

                m.delete()
                titleclr.stop()
                membed.edit({ content: membed.content, embeds: [msg] })
              })
            } else if (button.values[0] === 'setTitle') {
              button.reply({
                content: '請輸入您想顯示的「Embed 的標題」。',
                ephemeral: true
              })
              let filter = m => interaction.user.id === m.author.id
              let titleclr = button.channel.createMessageCollector({
                filter,
                time: 30000,
                max: 1
              })

              titleclr.on('collect', async m => {
                const url = membed.embeds[0].image
                  ? membed.embeds[0].image.url
                  : ''
                let msg = new MessageEmbed()
                  .setTitle(m.content)
                  .setURL(membed.embeds[0].url || '')
                  .setDescription(membed.embeds[0].description || '')
                  .setColor(membed.embeds[0].color || '#2F3136')
                  .setThumbnail(
                    membed.embeds[0].thumbnail
                      ? membed.embeds[0].thumbnail.url
                      : ''
                  )
                  .setImage(url || '')
                  .setFooter(membed.embeds[0].footer.text || '')
                m.delete()
                titleclr.stop()

                membed.edit({ content: membed.content, embeds: [msg] })
              })
            } else if (button.values[0] === 'setDescription') {
              button.reply({
                content: '請輸入您想顯示的「Embed 的內容」。',
                ephemeral: true
              })
              let filter = m => interaction.user.id === m.author.id
              let titleclr = button.channel.createMessageCollector({
                filter,
                time: 30000,
                max: 1
              })

              titleclr.on('collect', async m => {
                const url = membed.embeds[0].image
                  ? membed.embeds[0].image.url
                  : ''

                let msg = new MessageEmbed()
                  .setTitle(membed.embeds[0].title || '')
                  .setURL(membed.embeds[0].url || '')
                  .setDescription(m.content)
                  .setThumbnail(
                    membed.embeds[0].thumbnail
                      ? membed.embeds[0].thumbnail.url
                      : ''
                  )
                  .setColor(membed.embeds[0].color || '#2F3136')
                  .setImage(url || '')
                  .setFooter(membed.embeds[0].footer.text || '')
                m.delete()
                titleclr.stop()
                membed.edit({ content: membed.content, embeds: [msg] })
              })
            } else if (button.values[0] === 'setFooter') {
              button.reply({
                content: '請輸入您想顯示的「Embed 的頁腳」。',
                ephemeral: true
              })
              let filter = m => interaction.user.id === m.author.id
              let titleclr = button.channel.createMessageCollector({
                filter,
                time: 30000,
                max: 1
              })

              titleclr.on('collect', async m => {
                const url = membed.embeds[0].image
                  ? membed.embeds[0].image.url
                  : ''

                let msg = new MessageEmbed()
                  .setTitle(membed.embeds[0].title || '')
                  .setURL(membed.embeds[0].url || '')
                  .setThumbnail(
                    membed.embeds[0].thumbnail
                      ? membed.embeds[0].thumbnail.url
                      : ''
                  )
                  .setDescription(membed.embeds[0].description || '')
                  .setColor(membed.embeds[0].color || '#2F3136')
                  .setFooter(m.content || '')
                  .setImage(url || '')

                m.delete()

                titleclr.stop()

                membed.edit({ content: membed.content, embeds: [msg] })
              })
            }
          })
          collector.on('end', async (collected, reason) => {
            if (reason === 'time') {
              const content = new MessageButton()
                .setLabel('已逾時。')
                .setStyle('DANGER')
                .setCustomId('timeout|91817623842')
                .setDisabled()

              const row = new MessageActionRow().addComponents([content])

              e.edit({ embeds: [lel.embeds[0]], components: [row] })
            }
          })
        })
    } catch (err) {
      console.log(`Error Occured. | embedCreate | Error: ${err}`)
    }
  }
}
