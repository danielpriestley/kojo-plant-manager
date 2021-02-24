const router = require('express').Router();
const userHandlers = require('../handlers/users');

// Get
router.get('/', userHandlers.getAllUsers);
// router.get('/:id', userHandlers.getUser);

// Post
// router.post('/', userHandlers.addUser);

module.exports = router;
