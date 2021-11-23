module.exports = {
  name: 'embed',
  description: '簡單地創建一個Embed訊息。',
  category: '實用',
  async execute (bot, interaction) {
    await interaction.deferReply()

    await Embed(interaction)
  }
}
async function Embed (interaction) {
  try {

    const {
      MessageEmbed,
      MessageActionRow,
      MessageSelectMenu,
      MessageButton
    } = require('discord.js')

    const done = new MessageButton()
      .setLabel('Done')
      .setStyle('SUCCESS')
      .setCustomId('setDone')

    const reject = new MessageButton()
      .setLabel('Cancel/Delete')
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
      'Message outside of the embed',
      'Title of the embed',
      'Description of the embed',
      'URL in the title in the embed (hyperlink for title)',
      'Color of the embed',
      'Image in the embed',
      'Thumbnail in the embed',
      'Footer of the embed'
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
      .setPlaceholder('Embed Creation Options')
      .addOptions([menuOptions])

    const row = new MessageActionRow().addComponents([done, reject])

    const row2 = new MessageActionRow().addComponents([slct])

    const embed = new MessageEmbed()
      .setTitle(options.embedTitle || 'Embed Creator')
      .setDescription(
        'Select any ***option*** from the Select Menu in this message and i will **collect all informations and create a embed** for you using that data.\n\nThis is a completed embed.'
      )
      .setImage(
        'https://media.discordapp.net/attachments/867344516600037396/879238983492710450/unknown.png'
      )
      .setColor(options.embedColor || '#075FFF')
      .setFooter('CC-OSV')

    interaction.editReply({ embeds: [embed], components: [row2, row] })

    const emb = new MessageEmbed().setFooter('CC-OSV').setColor('#2F3136')

    interaction.channel
      .send({ content: '***Preview***', embeds: [emb] })
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
            button.reply({ content: 'Deleting...', ephemeral: true })

            membed.delete()
            e.delete()
            interaction.delete()
          } else if (button.customId && button.customId === 'setDone') {
            button.reply({ content: 'Done 👍', ephemeral: true })

            interaction.channel.send({
              content: membed.content,
              embeds: [membed.embeds[0]]
            })
            membed.delete()
            e.delete()
          } else if (button.values[0] === 'setContent') {
            button.reply({
              content:
                'Tell me what text you want for message outside of embed',
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
                'Tell me what image you want for embed thumbnail (small image at top right)',
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
                  'This is not a image url. Please provide a image url or attachment.'
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
              content: 'Tell me what color you want for embed',
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
                interaction.reply('Please give me a valid hex code')
              }
            })
          } else if (button.values[0] === 'setURL') {
            button.reply({
              content:
                'Tell me what URL you want for embed title (hyperlink for embed title)',
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
              content: 'Tell me what image you want for embed',
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
                  'This is not a image url. Please provide a image url or attachment.'
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
              content: 'Tell me what text you want for embed title',
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
              content: 'Tell me what text you want for embed description',
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
              content: 'Tell me what text you want for embed footer',
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
              .setLabel('Timeout')
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
