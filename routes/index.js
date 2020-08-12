const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const express = require('express');
const router = express.Router();

router.get('/',forwardAuthenticated, (req,res) => res.render('welcome.ejs'));

router.get('/dashboard',ensureAuthenticated, (req, res) =>
 res.render('dashboard.ejs', {
     user: req.user
 }));

module.exports = router;