require('dotenv').config();
require('module-alias/register');
require('moment-duration-format');

const Client = require('./base/CC-OSV-Client'),
  bot = new Client();

require('./handlers/EventHandler')(bot);
require(`./task/CangeChannelTime`)(bot);

const DBD = require('discord-dashboard');
const DarkDashboard = require('dbd-dark-dashboard');

let langsSettings = {};

let currencyNames = {};

let botNicknames = {};



const Dashboard = new DBD.Dashboard({
    port: 3000,
    client: {
        id: process.env.CLIENTID,
        secret: process.env.DashboardSecret
    },
    redirectUri: 'http://localhost/discord/callback',
    domain: 'http://localhost',
    bot: bot,
    theme: DarkDashboard({
      information: {
          createdBy: "CC_",
          websiteTitle: "CC-OSV",
          websiteName: "CC-OSV",
          websiteUrl: "http://localhost",
          supporteMail: "support@imidnight.ml", //Currently Unused
          imageFavicon: "https://www.imidnight.ml/assets/img/logo-circular.png",
          iconURL: 'https://www.imidnight.ml/assets/img/logo-circular.png',
          pagestylebg: "linear-gradient(to #2CA8FF, pink 0%, #155b8d 100%)",
          main_color: "#2CA8FF",
          sub_color: "#ebdbdb",
      },
      custom_html: {
          head: `123`,
          body: `1234`
      },
      invite: {
          client_id: '702229237234401321',
          redirectUri: 'http://localhost:3000/discord/callback',
          permissions: '8',
      },
      index: {
          card: {
              category: "iMidnight's Panel - The center of everything",
              title: `Welcome to the iMidnight discord where you can control the core features to the bot.`,
              image: "https://i.imgur.com/axnP93g.png",
              footer: "Footer"
          },
          information: {
              category: "Category",
              title: "Information",
              description: `This bot and panel is currently a work in progress so contact me if you find any issues on discord.`,
              footer: "Footer"
          },
          feeds: {
              category: "Category",
              title: "Information",
              description: `This bot and panel is currently a work in progress so contact me if you find any issues on discord.`,
              footer: "Footer"
          }
      },
      guilds: {
          cardTitle: "Guilds",
          cardDescription: "Here are all the guilds you currenly have permissions for:",
      },
      guildSettings: {
          cardTitle: "Guilds",
          cardDescription: "Here you can manage all the settings for your guild:",
      },
      // Optional Privacy Policy [Leave commented to use default template]
      privacyPolicy: {
          pp: `<p>Custom Privacy Policy</p>`
      },
      commands: {
          categoryOne: {
              category: `Fun Commands`,
              subTitle: `All Fun commands`,
              list: [{
                  commandName: "Test command",
                  commandUsage: "prefix.test <arg> [op]",
                  commandDescription: "Lorem ipsum dolor sth",
                  commandAlias: "Alias"
              },
              {
                  commandName: "2nd command",
                  commandUsage: "oto.nd <arg> <arg2> [op]",
                  commandDescription: "Lorem ipsum dolor sth, arg sth arg2 stuff",
                  commandAlias: "Alias"
              },
              {
                  commandName: "Test command",
                  commandUsage: "prefix.test <arg> [op]",
                  commandDescription: "Lorem ipsum dolor sth",
                  commandAlias: "Alias"
              }
              ],
          },
          categoryTwo: {
              enabled: "true",
              category: `Moderation Commands`,
              subTitle: `All Moderation commands`,
              list: [{
                  commandName: "Test command",
                  commandUsage: "prefix.test <arg> [op]",
                  commandDescription: "Lorem ipsum dolor sth",
                  commandAlias: "Alias"
              },
              {
                  commandName: "2nd command",
                  commandUsage: "oto.nd <arg> <arg2> [op]",
                  commandDescription: "Lorem ipsum dolor sth, arg sth arg2 stuff",
                  commandAlias: "Alias"
              },
              {
                  commandName: "Test command",
                  commandUsage: "prefix.test <arg> [op]",
                  commandDescription: "Lorem ipsum dolor sth",
                  commandAlias: "Alias"
              }
              ],
          },
          categoryThree: {
              enabled: "true",
              category: `Miscellaneous Commands`,
              subTitle: `All Miscellaneous commands`,
              list: [{
                  commandName: "Test command",
                  commandUsage: "prefix.test <arg> [op]",
                  commandDescription: "Lorem ipsum dolor sth",
                  commandAlias: "Alias"
              },
              {
                  commandName: "2nd command",
                  commandUsage: "oto.nd <arg> <arg2> [op]",
                  commandDescription: "Lorem ipsum dolor sth, arg sth arg2 stuff",
                  commandAlias: "Alias"
              },
              {
                  commandName: "Test command",
                  commandUsage: "prefix.test <arg> [op]",
                  commandDescription: "Lorem ipsum dolor sth",
                  commandAlias: "Alias"
              }
              ],
          },
          categoryFour: {
              enabled: "false",
              category: `List`,
              subTitle: `All commands`,
              list: [],
          },
          categoryFive: {
              enabled: "false",
              category: `List`,
              subTitle: `All commands`,
              list: [],
          }
      }
  }),
    settings: [
        {
            categoryId: 'setup',
            categoryName: "Setup",
            categoryDescription: "Setup your bot with default settings!",
            categoryOptionsList: [
                {
                    optionId: 'lang',
                    optionName: "Language",
                    optionDescription: "Change bot's language easily",
                    optionType: DBD.formTypes.select({"Polish": 'pl', "English": 'en', "French": 'fr'}),
                    getActualSet: async ({guild}) => {
                        return langsSettings[guild.id] || null;
                    },
                    setNew: async ({guild,newData}) => {
                        langsSettings[guild.id] = newData;
                        return;
                    }
                },
                {
                    optionId: 'nickname',
                    optionName: "Nickname",
                    optionDescription: "Bot's nickname on the guild",
                    optionType: DBD.formTypes.input("Bot username", 1, 16, false, true),
                    getActualSet: async ({guild}) => {
                        return botNicknames[guild.id] || false;
                    },
                    setNew: async ({guild,newData}) => {
                        botNicknames[guild.id] = newData;
                        return;
                    }
                },
            ]
        },
        {
            categoryId: 'eco',
            categoryName: "Economy",
            categoryDescription: "Economy Module Settings",
            categoryOptionsList: [
                {
                    optionId: 'currency_name',
                    optionName: "Currency name",
                    optionDescription: "Economy module Guild currency name",
                    optionType: DBD.formTypes.input('Currency name', null, 10, false, true),
                    getActualSet: async ({guild}) => {
                        return currencyNames[guild.id] || null;
                    },
                    setNew: async ({guild,newData}) => {
                        currencyNames[guild.id] = newData;
                        return;
                    }
                },
            ]
        },
    ]
});

Dashboard.init();
bot.login(process.env.TOKEN);

module.exports = bot;