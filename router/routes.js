const router = require('express').Router();
const db = require('./db/queries');

router.get('/', db.getAllUsers);

module.exports = router;
