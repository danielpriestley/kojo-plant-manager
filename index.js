// INDEX.JS IS THE ENTRY POINT FOR THE SERVER
require('dotenv').config();

// TODO:
// add auth
// add security
// fix express-session warnings

// Packages
const express = require('express');
const session = require('express-session');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { hash, compare } = require('bcryptjs');
const { sign, verify } = require('jsonwebtoken');

const cors = require('cors');
const { pool } = require('./config');

// // Import the functions for querying postgresql
const db = require('./db/queries');

// Initialize Express
const app = express(),
	corsOption = {
		origin: true,
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		credentials: true,
		exposedHeaders: [ 'x-auth-token' ]
	};
// const router = require('./router/routes');

// MIDDLEWARE
// Body Parser
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

// Cookie Parser
app.use(cookieParser());
app.use(cors());

// --- AUTH ---

app.get('/api/v1/token', function(req, res) {
	const token = req.headers.authorization.split(' ')[1];
	if (!req.headers.authorization) {
		return res.send(401, 'Authentication error. Token not entered');
	} else {
		const result = verify(token, process.env.JWT);
		if (!result) {
			return res.send(401, 'Authentication error. Token not entered or invalid');
		} else {
			// Can use the result value email to fetch the users data from database
			return res.json({
				data: result
			});
		}
	}
});

app.post('/api/v1/auth/signup', function(req, res) {
	const { email, password, name } = req.body;
	if (!email) {
		return res.send(401, 'Authentication error. Invalid Credentials');
	} else {
		pool.query('SELECT * FROM users WHERE email = $1', [ email ], async function(err, rows) {
			if (err) throw err;
			if (rows && rows.rowCount === 0) {
				console.log('There is no such user, adding now');
				const hashedPassword = await hash(password, 10);

				pool.query('INSERT into users(email,password,name) VALUES($1, $2, $3)', [
					email,
					hashedPassword,
					name
				]);
				return {
					token: sign({ email: email }, process.env.JWT)
				};
			} else {
				console.log('User already exists in database');
			}
		});
	}
});

app.post('/api/v1/auth/login', function(req, res) {
	const { email, password } = req.body;
	if (!email) {
		return res.send(401, 'Authentication error. Invalid Credentials');
	} else {
		pool.query('SELECT * from users where email = $1', [ email ], async function(err, results) {
			if (err) throw err;
			if (results.rows && results.rows.rowCount === 0) {
				console.log('There is no such user');
			} else {
				console.log('User exists in database');

				const passwordValid = await compare(password, results.rows[0].password);
				if (!passwordValid) {
					console.log('Invalid password');
				} else {
					const token = sign({ email: req.body.email }, process.env.JWT);
					res.status(200).send(token);
				}
			}
		});
	}
});

// --- API CALLS ---
// Routes for Users

app.get('/api/v1/users', db.getAllUsers);
app.post('/api/v1/users', db.createUser);
app.get('/api/v1/users/:id', db.getUserById);
app.delete('/api/v1/users/:id', db.deleteUser);
app.put('/api/v1/users/:id', db.updateUser);

// Routes for Plants
app.get('/api/v1/plants', db.getAllPlants);
app.post('/api/v1/plants', db.createPlant);
app.get('/api/v1/plant/:id', db.getPlantById);
app.get('/api/v1/plants/:id', db.getAllPlantsByUser);
app.delete('/api/v1/plants/:id', db.deletePlant);
app.put('/api/v1/plants/:id', db.updatePlant);

app.listen(process.env.PORT || 3002, () => {
	console.log('App listening!');
});
