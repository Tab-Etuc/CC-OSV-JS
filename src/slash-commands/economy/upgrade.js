module.exports = {
    name: "升級",
    description: "提升銀行存額或利息等階。",
    category: "經濟",
    options: [
        {
            name: "選項",
            type: "STRING",
            description: "您欲升等之類別。",
            required: true,
            choices: [
                {
                    name: "銀行存額",
                    value: "bankSpace"
                },
                {
                    name: "利息",
                    value: "interest"
                }
            ]
        },
        {
            name: "升級次數",
            type: "STRING",
            description: "您欲升幾級？（註：輸入\"all\"、\"所有\"等，可一次性升至最大等級。）",
            required: true
        },],
    async execute(bot, interaction) {
        const arg = interaction.options.getString("選項", false);
        const up_amount = interaction.options.getString("升級數", false);
        if (arg === 'bankSpace') {
            if (up_amount === 'all' || arg === '全部' || arg === '全' || arg === '所有' || arg === 'a' || arg === 'ＡＬＬ' || arg === 'ａｌｌ' || arg === 'ａ') {
                const member_amount = await bot.fetchUser(bot, interaction.member.id);
                let coinsInWallet = member_amount.coinsInWallet
                let coinsInBank = member_amount.coinsInBank
                let bankSpace = member_amount.bankSpace
                let cost_data = Math.round(bankSpace * -0.79)
                let up_data = Math.round(bankSpace * 1.20)

                while (cost_data + coinsInWallet >= 0){
                    Math.round(coinsInWallet += cost_data)
                    Math.round(bankSpace * 1.20)
                    cost_data = Math.round(bankSpace * -0.79)
                }
                
            }
            const member_amount = await bot.fetchUser(bot, interaction.member.id);
            let coinsInWallet = member_amount.coinsInWallet
            let coinsInBank = member_amount.coinsInBank
            let bankSpace = member_amount.bankSpace
            let cost_data = bankSpace * -0.79
            let up_data = bankSpace * 1.21
            if (cost_data + coinsInWallet < 0) { // 當現金不夠升級銀行存額
                if (coinsInBank + cost_data >= 0) { // 當銀行餘額可以升級

                } else if ((coinsInBank + coinsInWallet) + cost_data >= 0) { // 當銀行餘額+現金可以升級

                } else { // 錢不夠升級
                    return interaction.reply(`您的餘額（現金+銀行餘額=${coinsInWallet + coinsInBank}）不足${-1 * cost_data}。\n您還需要${-1 * ((coinsInWallet + coinsInBank) + cost_data)}元！`)
                }
            }

        } else if (arg === 'interest') {
            const up_amount = interaction.options.getString("升級數", false);
            const member_amount = await bot.fetchUser(bot, interaction.member.id);
            let coinsInWallet = member_amount.coinsInWallet
            let coinsInBank = member_amount.coinsInBank
            let interest = member_amount.interest
            let cost_data = (interest * 100) ** 5
            let up_data = interest + 0.01
            if (cost_data + coinsInWallet < 0) { // 當現金不夠升級利息
                if (coinsInBank + cost_data >= 0) { // 當銀行餘額可以升級利息

                } else if ((coinsInBank + coinsInWallet) + cost_data >= 0) { // 當銀行餘額+現金可以升級利息

                } else { // 錢不夠升級利息
                    return interaction.reply(`您的餘額（現金+銀行餘額=${coinsInWallet + coinsInBank}）不足${-1 * cost_data}。\n您還需要${-1 * ((coinsInWallet + coinsInBank) + cost_data)}元！`)
                }
            }
        }

    }
}