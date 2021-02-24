const { pool } = require('../config');

// TODO:
// Add comments to each request for better reuse and managing of code
// GetGrowingPlants
// GetGrownPlants
// GetPlantsByLocation

// --- QUERIES FOR USERS ---

// REQ: GET
// PATH: /users
// METHOD: getUsers()
// DESC: Gets all users
const getAllUsers = (req, res) => {
	pool.query('SELECT * FROM users ORDER BY userID ASC', (error, results) => {
		if (error) {
			throw error;
		}
		res.status(200).json(results.rows);
	});
};

const createUser = (req, res) => {
	const { email, password, name } = req.body;
	pool.query(
		"INSERT INTO users (email, password, name) VALUES ($1, crypt(($2), gen_salt('bf')), $3)",
		[ email, password, name ],
		(error, result) => {
			if (error) {
				throw error;
			}
			res.status(201).send(`User ${name} created with id: ${result.userID}`);
		}
	);
};

const getUserById = (req, res) => {
	const id = req.params.id;
	pool.query('SELECT * FROM users WHERE userID = $1', [ id ], (error, results) => {
		if (error) {
			throw error;
		}
		res.status(200).json(results.rows);
	});
};

const deleteUser = (req, res) => {
	const id = req.params.id;
	pool.query('DELETE FROM users WHERE userID = $1', [ id ], (error, results) => {
		if (error) {
			throw error;
		}
		res.status(201).send(`User with id: ${id} deleted`);
	});
};

const updateUser = (req, res) => {
	const { email, password, name } = req.body;
	const id = parseInt(req.params.id);
	pool.query(
		"UPDATE users SET email = $1, password = crypt(($2), gen_salt('bf')) , name = $3 WHERE userID = $4",
		[ email, password, name, id ],
		(error, result) => {
			if (error) {
				throw error;
			}
			res.status(201).send(`User ${name} updated`);
		}
	);
};

// --- QUERIES FOR PLANTS ---

const getAllPlants = (req, res) => {
	pool.query('SELECT * FROM plants ORDER BY plantID ASC', (error, results) => {
		if (error) {
			throw error;
		}
		res.status(200).json(results.rows);
	});
};

const getAllPlantsByUser = (req, res) => {
	const id = req.params.id;
	pool.query('SELECT * FROM plants WHERE userID = $1 ORDER BY plantID ASC', [ id ], (error, results) => {
		if (error) {
			throw error;
		}
		res.status(200).json(results.rows);
	});
};

const createPlant = (req, res) => {
	const { userID, plantname, location } = req.body;
	pool.query(
		'INSERT INTO plants (userID, plantname, location) VALUES ($1, $2, $3)',
		[ userID, plantname, location ],
		(error, result) => {
			if (error) {
				throw error;
			}
			res.status(201).send(`Plant ${plantname} created belonging to user ${userID}`);
		}
	);
};

const deletePlant = (req, res) => {
	const id = req.params.id;
	pool.query('DELETE FROM plants WHERE plantID = $1', [ id ], (error, results) => {
		if (error) {
			throw error;
		}
		res.status(200).send(`Plant with id: ${id} deleted`);
	});
};

const getPlantById = (req, res) => {
	const id = req.params.id;
	pool.query('SELECT * FROM plants WHERE plantID = $1', [ id ], (error, results) => {
		if (error) {
			throw error;
		}
	});
	res.status(200).json(results.rows);
};

const updatePlant = (req, res) => {
	const { plantname, location, reaping, sowing } = req.body;
	const id = parseInt(req.params.id);
	pool.query(
		'UPDATE plants SET plantname = $1, location = $2, reaping = $3, sowing = $4 WHERE plantID = $5',
		[ plantname, location, reaping, sowing, id ],
		(error, result) => {
			if (error) {
				throw error;
			}
			res.status(201).send(`Plant ${plantname} updated`);
		}
	);
};

module.exports = {
	getAllUsers,
	createUser,
	getUserById,
	deleteUser,
	updateUser,
	getPlantById,
	getAllPlants,
	getAllPlantsByUser,
	createPlant,
	deletePlant,
	updatePlant
};
