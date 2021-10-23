const express = require("express"),
	CheckAuth = require("../auth/CheckAuth"),
	router = express.Router();
	require('dotenv').config()

router.get("/", CheckAuth, async (req, res) => {
	res.redirect("/selector");
});

router.get("/selector", CheckAuth, async(req, res) => {
	res.render("selector", {
		user: req.userInfos,
		currentURL: `${process.env.DashboardBaseURL}/${req.originalUrl}`
	});
});

module.exports = router;