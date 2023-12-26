// login register router use express
const express = require('express');
const router = express.Router();
const loginHandler = require('../router_handle/login');

// import interface from router_handle
router.post('/register', loginHandler.register)
router.post('/login', loginHandler.login)

module.exports = router;