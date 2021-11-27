const DBDStats = require("../ExternalStatistics");
const fs = require("fs");
const {v4: uuidv4} = require("uuid");
const readline = require("readline-sync");
module.exports = (config, themeConfig, DBDStats, secretInit, modules, aaThis) => {
    DBDStats.registerProject(config.client.id);
    const fs = require('fs');

    if (fs.existsSync(require('path').join(__dirname, '/../.devChannel'))) return aaThis.secretInit(aaThis.modules);
    const projectStats = fs.readFileSync(require('path').join(__dirname, '/../project.json'));
    const projectData = JSON.parse(projectStats);

    if(!projectData.id)projectData.id = uuidv4();
    projectData.name = `${config.websiteTitle || themeConfig.websiteName}`;
    fs.writeFileSync(require('path').join(__dirname, '/../project.json'), JSON.stringify(projectData, null, 3))
    if(config.acceptPrivacyPolicy) return aaThis.secretInit(aaThis.modules);
    const ppAccepted = fs.readFileSync(require('path').join(__dirname, '/../ppAccepted.txt'), 'utf8');
    if (ppAccepted == "accepted") return aaThis.secretInit(aaThis.modules);
    let oThis = {secretInit, modules};
    const readline = require("readline-sync");

    setTimeout(function() {
        console.log(`${'[Discord-dashboard v'.blue}${`${require('../package.json').version}]:`.blue} Hello! First of all, we would like to thank you for your trust and choosing the ${'discord-dashboard'.rainbow}.`)
    }, 2000);
    setTimeout(function() {
        console.log(`${'[Discord-dashboard v'.blue}${`${require('../package.json').version}]:`.blue} However, we must familiarize you with our privacy policy and describe to you how we collect your data.`);
    }, 4000);
    setTimeout(function() {
        console.log(`
${'[Discord-dashboard v'.blue}${`${require('../package.json').version}]:`.blue} To maintain the quality of our services at the highest level, we collect from you:
${'[Discord-dashboard v'.blue}${`${require('../package.json').version}]:`.blue} - The ID of your Discord-Client,
${'[Discord-dashboard v'.blue}${`${require('../package.json').version}]:`.blue} - The number of users who log in to your panel (we also collect their IDs, but only to distinguish them from other, same login sessions),
${'[Discord-dashboard v'.blue}${`${require('../package.json').version}]:`.blue} - The types of settings you use that go beyond the basic ones. It does not include settings such as sensitive settings, e.g. your bot data.
${'[Discord-dashboard v'.blue}${`${require('../package.json').version}]:`.blue} We must add that your data is available only to the Project Administrator - breathtake. Nobody else can see it. Your data is not transferred anywhere either.
        
${'[Discord-dashboard v'.red}${`${require('../package.json').version}]:`.red} If you can't type in the console, pass 'acceptPrivacyPolicy: true,' to the discord-dashboard config.`);
        let iCount = 0;

        function ask() {
            if (iCount > 0) console.log(`${'[Discord-dashboard v'.red}${`${require('../package.json').version}]:`.red}: You must accept our privacy policy to be able to use the module. Otherwise, you must delete the module.`);
            iCount++;
            const rlResponse = readline.question(`${'[Discord-dashboard v'.blue}${`${require('../package.json').version}]:`.blue} Do you accept it? (y/n) `);

            if (rlResponse == "y" || rlResponse == "yes") {
                console.log(`${'[Discord-dashboard v'.green}${`${require('../package.json').version}]:`.green} Thank you. Now we will run the module for you. You will not need to re-approve our privacy policy again.`)
                fs.writeFileSync(require('path').join(__dirname, '/../ppAccepted.txt'), 'accepted');
                setTimeout(function() {
                    aaThis.secretInit(aaThis.modules);
                }, 1000);
            } else ask();
        }
        ask();
    }, 6000);
}