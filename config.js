// Get environment variables from dotenv
require('dotenv').config();

// Initialise Pool from node-postgres
const { Pool } = require('pg');

// set the value of isProduction to production when the NODE_ENV environment variable is 'production'
const isProduction = process.env.NODE_ENV === 'production';

// Initialise the connection string
const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env
	.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

// Create a pool and set the connection string to the DATABASE_URL if isProduction is true (set to production), else use the provided connection string
const pool = new Pool({
	connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
	ssl: isProduction
});

module.exports = { pool };
