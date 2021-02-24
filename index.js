// INDEX.JS IS THE ENTRY POINT FOR THE SERVER
require('dotenv').config();

// Packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { pool } = require('./config');

// // Import the functions for querying postgresql
const db = require('./db/queries');

// Initialize Express
const app = express();
// const router = require('./router/routes');

// MIDDLEWARE
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);
app.use(cors());

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
app.get('/api/v1/plants/:id', db.getAllPlantsByUser);
app.delete('/api/v1/plants/:id', db.deletePlant);
app.put('/api/v1/plants/:id', db.updatePlant);

app.listen(process.env.PORT || 3002, () => {
	console.log('App listening!');
});
