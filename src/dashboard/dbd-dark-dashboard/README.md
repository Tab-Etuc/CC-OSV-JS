# DarkDashboard
DarkDashboard free theme.
This is nearly completed. Message me on discord if you find any bugs, iMidnight#1602.
Most of the variables are not the same as Capriham theme so you may need to change them.
# Install

```
npm i dbd-dark-dashboard
```

# Docs

Documentation is the same but the template isnt the same.
https://assistants.ga/dbd-docs/#/?id=capriham

# Look

![image1](https://i.imgur.com/33sk9Gi.png)
![image2](https://i.imgur.com/l7PFxSW.png)
![image3](https://i.imgur.com/eg7BHZd.png)
![image4](https://i.imgur.com/BSYQiXW.png)
![image5](https://i.imgur.com/cZmoHl9.png)


# Usage

[discord-dashboard](https://github.com/breftejk/Discord.js-Web-Dashboard) config:

```js
const DBD = require('discord-dashboard');
const DarkDashboard = require('dbd-dark-dashboard');

const Dashboard = new DBD.Dashboard({
...
    theme: DarkDashboard({
        information: {
            createdBy: "iMidnight",
            websiteTitle: "iMidnight",
            websiteName: "iMidnight",
            websiteUrl: "https:/www.imidnight.ml/",
            supporteMail: "support@imidnight.ml", //Currently Unused
            imageFavicon: "https://www.imidnight.ml/assets/img/logo-circular.png",
            iconURL: 'https://www.imidnight.ml/assets/img/logo-circular.png',
            pagestylebg: "linear-gradient(to #2CA8FF, pink 0%, #155b8d 100%)",
            main_color: "#2CA8FF",
            sub_color: "#ebdbdb",
        },
        custom_html: {
            head: ``,
            body: ``
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
        //Optional Privacy Policy [Leave commented to use default template]
        // privacyPolicy: {
        //     pp: `<p>Custom Privacy Policy</p>`
        // },
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
...
});

Dashboard.init();
```
