const express = require("express"),
	router = express.Router();
	require('dotenv').config()

// Gets login page
router.get("/", async function(req, res) {
	await req.session.destroy();
	res.redirect(process.env.DashboardFailureURL);
});

module.exports = router;