const router = require('express').Router();
const plantHandlers = require('../handlers/plants');

// Get
router.get('/', plantHandlers.getAllplants);
router.get('/:id', plantHandlers.getplant);

// Put
router.put('/:id', plantHandlers.updatePlant);

// Post
router.post('/', plantHandlers.addPlant);

// Delete
router.delete('/:id', plantHandlers.deletePlant);

module.exports = router;
