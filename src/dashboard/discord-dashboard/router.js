module.exports = (app, config, themeConfig, modules) => {
    app.use('/discord', require('./Routes/discord'));

    if (config.useUnderMaintenance) {
        app.get(config.underMaintenanceAccessPage || '/total-secret-get-access', (req, res) => {
            res.send(`
               <form action="${config.domain}${config.underMaintenanceAccessPage || '/total-secret-get-access'}" method="POST" >
                    <input id="accessKey" name="accessKey"/>
                    <button role="submit">提交</button>
               </form>
               `)
        });

        app.post(config.underMaintenanceAccessPage || '/total-secret-get-access', (req, res) => {
            if (!req.body) req.body = {};
            const accessKey = req.body.accessKey;
            if (accessKey != config.underMaintenanceAccessKey) return res.send('Wrong key.');
            req.session.umaccess = true;
            res.redirect('/');
        });

        app.use((req, res, next) => {
            if (!req.session.umaccess && !req.session.user) return res.send(config.underMaintenanceCustomHtml || require('./underMaintenancePageDefault')(config.underMaintenance, false));
            else if(!req.session.umaccess && config.ownerIDs && !config.ownerIDs.includes(req.session.user.id)) return res.send(config.underMaintenanceCustomHtml || require('./underMaintenancePageDefault')(config.underMaintenance, true));
            else next();
        });
    }

    app.use('/', require('./Routes/main')(app, config, themeConfig));
    app.use('/', require('./Routes/dashboard')(app, config, themeConfig));

    config.theme.init(app, config);

    let customPages = config.customPages || [];
    customPages.forEach(p => {
        if (p.type == "redirect") {
            app.get(p.endpoint, async (req, res) => {
                let endpoint = await p.getEndpoint({
                    user: req.session.user || {}
                });
                res.redirect(endpoint);
            });
        } else if (p.type == "html") {
            app.get(p.endpoint, async (req, res) => {
                let html = await p.getHtml({
                    user: req.session.user || {}
                });
                res.send(html);
            });
        } else if (p.type == "json") {
            app.get(p.endpoint, async (req, res) => {
                let json = await p.getJson({
                    user: req.session.user || {}
                });
                res.send(json);
            });
        }
    });

    modules.forEach(module => {
        module.app({
            app: app,
            config: this.config,
            themeConfig: themeConfig
        });
    });

    app.get('*', (req, res) => {
        let text = config.html404 || require('./404pagedefault')(config.websiteTitle || themeConfig.websiteName);
        res.send(text.replace('{{websiteTitle}}', config.websiteTitle || themeConfig.websiteName));
    });
}
