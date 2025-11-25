// src/server.js
// Robust startup: DB connect, environment-aware schema handling (sync vs migrations),
// graceful shutdown, and global error handlers.

const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const db = require('./db'); // assumes ./db exports { sequelize, Sequelize, ... }

const PORT = parseInt(process.env.PORT, 10) || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

let server;

async function start() {
  try {
    // 1) Test DB connection
    await db.sequelize.authenticate();
    console.log('DB connected');

    // 2) Schema handling
    if (NODE_ENV === 'production') {
      console.log('Production mode: do NOT run sync({ alter: true }). Run migrations instead.');
      // optional: you could run migrations here if desired:
      // const { Umzug, SequelizeStorage } = require('umzug');
      // OR instruct your CI to run: npx sequelize-cli db:migrate
    } else {
      // keep previous dev behavior (preserve original intent)
      console.log('Development mode: running sequelize.sync({ alter: true })');
      await db.sequelize.sync({ alter: true });
    }

    // 3) Start HTTP server
    server = app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} (env: ${NODE_ENV})`);
    });

    // 4) Graceful shutdown
    const shutdown = async (signal) => {
      try {
        console.log(`Received ${signal}. Closing HTTP server and DB connection...`);
        if (server) {
          server.close(() => console.log('HTTP server closed'));
        }
        if (db && db.sequelize) {
          await db.sequelize.close();
          console.log('DB connection closed');
        }
        // give some time for logs to flush, then exit
        process.exit(0);
      } catch (err) {
        console.error('Error during graceful shutdown', err);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

// Global process-level handlers
process.on('uncaughtException', (err) => {
  console.error('uncaughtException', err);
  // it's typically safest to exit
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('unhandledRejection at:', promise, 'reason:', reason);
  // optionally exit, but here we log and keep running for now
  // process.exit(1);
});

start();
