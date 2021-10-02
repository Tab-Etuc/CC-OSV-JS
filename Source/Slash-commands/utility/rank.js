
const Levels = require("../../models/Levels.js");
const { MessageAttachment } = require('discord.js');
const Canvas = require('canvas');

module.exports = {
    name: "rank",
    description: "顯示您的聊天等級。",
    category: "實用",
    async execute(bot, interaction) {

        const member =  interaction.member

        let levelData = await Levels.findOne({
            guildId: interaction.guild.id,
            userId: member.id
        });

        let rank = await Levels.find({
            guildId: interaction.guild.id
        }).sort({
            totalXp: -1
        }).exec();
        rank = rank.filter(x => interaction.guild.members.cache.has(x.userId)).findIndex(x => x.userId == member.id) + 1;

        const applyText = (canvas, text) => {
            const context = canvas.getContext('2d');
            let fontSize = 50;

            do {
                context.font = `${fontSize -= 10}px sans-serif`;
            } while (context.measureText(text).width > canvas.width - 300);

            return context.font;
        };
        const applyText_eng = (canvas, text) => {
            const context = canvas.getContext('2d');
            let fontSize = 70;

            do {
                context.font = `${fontSize -= 5}px sans-serif`;
            } while (context.measureText(text).width > canvas.width - 460);

            return context.font;
        };
        const canvas = Canvas.createCanvas(535, 177);
        const context = canvas.getContext('2d');

        // Since the image takes time to load, you should await it
        const background = await Canvas.loadImage('https://cdn.discordapp.com/attachments/854215565882294274/876791656605708358/image_7.png');

        // This uses the canvas dimensions to stretch the image onto the entire canvas

        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        // context.font = '28px sans-serif';
        // context.fillStyle = '#ffffff';
        // context.fillText('Profile', canvas.width / 2.5, canvas.height / 3.5);
        let testUser = interaction.guild.members.cache.get(member.id);
        let testUsers = [];
        testUsers.push(testUser);

        context.font = applyText(canvas, `${member.nickname ? member.nickname : member.user.username}`);
        context.fillStyle = '#ffffff';
        context.fillText(`${member.nickname ? member.nickname : member.user.username}`, canvas.width / 2.84, canvas.height / 2.3);

        context.font = applyText_eng(canvas, `Level ${levelData ? levelData.level : 1}`);
        context.fillStyle = '#ffffff';
        context.fillText(`Level ${levelData ? levelData.level : 1}`, canvas.width / 2.8, canvas.height / 1.5);

        context.font = applyText_eng(canvas, `Rank #${rank}`);
        context.fillStyle = '#abddde';
        context.fillText(`Rank #${rank}`, canvas.width / 1.3, canvas.height / 2.3);

        context.font = applyText_eng(canvas, `${numberFormat(levelData ? levelData.xp : 0)}/${numberFormat(levelData ? levelData.xpToLevel : 100)}`);
        context.fillStyle = '#ffffff';
        context.fillText(`${numberFormat(levelData ? levelData.xp : 0)}/${numberFormat(levelData ? levelData.xpToLevel : 100)}`, canvas.width / 1.3, canvas.height / 1.5);



        let lingrad = context.createLinearGradient(canvas.width / 2.8, canvas.height / 1.35, 295, 25);
        lingrad.addColorStop(0.1, '#f4a261');
        lingrad.addColorStop(1, '#e9c46a');


        context.fillStyle = lingrad;
        context.fillRect(canvas.width / 2.8, canvas.height / 1.35, 295, 25);

        context.strokeStyle = '#ffffff';
        // Draw a rectangle with the dimensions of the entire canvas
        context.lineJoin = 'round';
        context.strokeRect(canvas.width / 2.8, canvas.height / 1.35, 295, 25);
        let levelP = Math.round(
            (
                levelData ? levelData.xp : 0
            ) / (
                levelData ? levelData.xpToLevel : 100
            ) * 100
        )
        context.font = 0 <= levelP && levelP <= 9 ? `15px sans - serif` : `20px sans - serif`;
        context.fillStyle = '#0E6BA8';
        context.fillText(
            `${Math.round(
                (
                    levelData ? levelData.xp : 0
                ) / (
                    levelData ? levelData.xpToLevel : 100
                ) * 100
            )
            }% `,
            canvas.width / 1.68,
            canvas.height / 1.175
        );


        context.beginPath();
        context.arc(90, 90, 70, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();


        const avatar = await Canvas.loadImage(member.user.displayAvatarURL({
            format: 'png',
            size: 256,
            dynamic: true
        }));
        context.drawImage(avatar, 20, 20, 140, 140);

        const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');

        interaction.reply({
            files: [attachment]
        })
    },
};

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
