const { pool } = require('../config');

// REQ: GET
// PATH: /users
// METHOD: getUsers()
// DESC: Gets all users
const getAllUsers = (req, res) => {
	pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
		if (error) {
			throw error;
		}
		res.status(200).json(results.rows);
	});
};

module.exports = getAllUsers;
