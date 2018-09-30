const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const envType = process.env.ENV_TYPE;
const databaseURL = envType === 'DEV' ? process.env.LOCAL_DATABASE_URL : process.env.REMOTE_DATABASE_URL;

const pool = new Pool({
  connectionString: databaseURL,
});

pool.on('connect', () => {
  console.log('connected to the local database', databaseURL);
});

/**
 * Create Tables
 */

const createOrdersTable = () => {
  console.log('db', databaseURL);
  const queryText = `CREATE TABLE IF NOT EXISTS
      orders(
        order_id VARCHAR(128) NOT NULL,
        ordered_by VARCHAR(128) NOT NULL,
        ordered_items VARCHAR(128) NOT NULL,
        total_mount NUMERIC(11, 2) NOT NULL,
        Order_status VARCHAR(128) NOT NULL,
        delivery_status VARCHAR(128) NOT NULL,
        created_at TIMESTAMP,
        updated_at TIMESTAMP
      )`;

  pool
    .query(queryText)
    .then((res) => {
      console.log('res:', res);
      pool.end();
    })
    .catch((err) => {
      console.log('err:', err);
      pool.end();
    });
};

const createUsersTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
      users(
        user_id UUID PRIMARY KEY,
        fullname VARCHAR(128) NOT NULL,
        email VARCHAR(128) NOT NULL,
        password VARCHAR(128) NOT NULL,
        address TEXT NOT NULL,
        mobile VARCHAR(128) NOT NULL,
        created_at TIMESTAMP,
        updated_at TIMESTAMP
      )`;

  pool
    .query(queryText)
    .then((res) => {
      console.log('res:', res);
      pool.end();
    })
    .catch((err) => {
      console.log('err:', err);
      pool.end();
    });
};

const createFoodsTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
      foods(
        food_id UUID PRIMARY KEY,
        food_name VARCHAR(128) NOT NULL,
        food_cat VARCHAR(128) NOT NULL,
        description TEXT NOT NULL,
        img VARCHAR(128) NOT NULL,
        unitPrice NUMERIC(11, 2) NOT NULL,
        quantityAvailable NUMERIC(11) NOT NULL,
        created_at TIMESTAMP,
        updated_at TIMESTAMP
      )`;

  pool
    .query(queryText)
    .then((res) => {
      console.log('res:', res);
      pool.end();
    })
    .catch((err) => {
      console.log('err:', err);
      pool.end();
    });
};

/**
 * Drop Tables
 */
const dropOrdersTable = () => {
  const queryText = 'DROP TABLE IF EXISTS orders';
  pool
    .query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const dropUsersTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users';
  pool
    .query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const dropFoodsTable = () => {
  const queryText = 'DROP TABLE IF EXISTS foods';
  pool
    .query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const createAllTables = () => {
  createUsersTable();
  createOrdersTable();
  createFoodsTable();
};

const dropAllTables = () => {
  dropFoodsTable();
  dropOrdersTable();
  dropUsersTable();
};

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createAllTables,
  createOrdersTable,
  createUsersTable,
  createFoodsTable,
  dropAllTables,
  dropUsersTable,
  dropOrdersTable,
  dropFoodsTable,
};

require('make-runnable');
