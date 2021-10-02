module.exports = {
    name: "存款",
    description: "將您的現金存入銀行。",
    category: "經濟",
    options: [{
        name: '金額',
        type: 'STRING',
        description: '您欲存入的現金金額。（註：輸入"all"、"所有"等，可一次性存入所有現金。）',
        required: true,
    }],
    async execute(bot, interaction) {
        let data = await bot.mongo.fetchUser(bot, interaction.member.id);
        const arg = interaction.options.getString("金額", false);
        if (arg.toLowerCase() === 'all' || arg === '全部'|| arg === '全'|| arg === '所有'|| arg === 'a'|| arg === 'ＡＬＬ'|| arg === 'ａｌｌ'|| arg === 'ａ') {
            if (data.coinsInWallet > data.bankSpace) {
                const max_deposit = (data.coinsInWallet + data.coinsInBank - data.bankSpace);

                data.coinsInWallet = max_deposit;

                await interaction.reply(`已存入 \`${data.bankSpace - data.coinsInBank}\` 元！`);

                data.coinsInBank = ((data.coinsInWallet + data.bankSpace) - max_deposit);

                await data.save();
            } else {

                if ((data.coinsInWallet + data.coinsInBank) > data.bankSpace) {
                    const left = (data.coinsInWallet + data.coinsInBank) - data.bankSpace;

                    interaction.reply(`已存入 \`${(data.coinsInWallet - left).toLocaleString()}\` 元！`);

                    data.coinsInBank += (data.coinsInWallet - left);
                    data.coinsInWallet = left;

                    await data.save();
                } else {
                    interaction.reply(`已存入 \`${(data.coinsInWallet).toLocaleString()}\` 元！`);

                    data.coinsInBank += data.coinsInWallet;
                    data.coinsInWallet = 0;

                    await data.save();
                }
            }
        } else {
            if (isNaN(arg)) {
                return interaction.reply('請您輸入一個正確的數字。');
            }

            if (parseInt(arg) > data.bankSpace) {
                return interaction.reply('您的銀行存額不足，請提升。');
            }
            if (parseInt(arg) > data.coinsInWallet) {
                return interaction.reply("您沒有這麼多錢。");
            }   
            if (parseInt(arg) > data.bankSpace - data.coinsInBank) {
                return interaction.reply("您的銀行存額不足，請提升。");
            }

            data.coinsInBank += parseInt(args[0]);

            await interaction.reply(`已存入 \`${args[0]}\` 元！`);

            data.coinsInWallet -= parseInt(args[0]);

            await data.save();
        }
    }
}