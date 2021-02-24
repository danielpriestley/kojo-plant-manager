const router = require('express').Router();
const userRoutes = require('./users');
const plantRoutes = require('./plants');

router.use('/users', userRoutes);
router.use('/plants', plantRoutes);

module.exports = router;
