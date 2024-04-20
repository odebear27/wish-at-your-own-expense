import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  // maximum number of clients the pool should contain
  max: 20,
  // number of milliseconds a client must sit idle in the pool and not be checked out
  // before it is disconnected from the backend and discarded
  // default is 10000 (10 seconds) - set to 0 to disable auto-disconnection of idle clients
  idleTimeoutMillis: 30000,
  // number of milliseconds to wait before timing out when connecting a new client
  // by default this is 0 which means no timeout
  connectionTimeoutMillis: 2000,
});

module.exports = pool;
