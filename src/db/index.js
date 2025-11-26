// src/db/index.js
const fs = require('fs');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

//
// Flexible Sequelize model loader:
// - Skips models/index.js
// - Supports factories exported as (sequelize) or (sequelize, DataTypes)
// - Runs model.associate(db) when present
//

// Create Sequelize instance using DATABASE_URL if present, otherwise env parts
let sequelize;
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    // Important for Neon and other managed Postgres instances that require TLS/SSL
    dialectOptions: {
      ssl: {
        require: true,
        // In many Node environments the server cert chain is fine; if you see certificate
        // verification errors when connecting to Neon, set rejectUnauthorized: false.
        // For stricter security in production, supply CA certs and set this to true.
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME || 'enquiry_db',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'password',
    {
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      dialect: 'postgres',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

const db = {};
const modelsDir = path.join(__dirname, '..', 'models');

console.log('Loading models from:', modelsDir);

if (!fs.existsSync(modelsDir)) {
  console.warn(`Models directory does not exist: ${modelsDir}`);
} else {
  const files = fs.readdirSync(modelsDir)
    .filter((file) =>
      file.endsWith('.js') &&
      file !== path.basename(__filename) && // skip this file (db/index.js) if it appears somehow
      file !== 'index.js' &&               // skip models/index.js
      !file.startsWith('.')
    );

  for (const file of files) {
    const fullPath = path.join(modelsDir, file);
    console.log('Requiring model file:', file);
    let required;
    try {
      required = require(fullPath);
    } catch (err) {
      console.error(`Failed to require model file "${file}":`, err && err.message ? err.message : err);
      continue;
    }

    // Determine factory
    let modelFactory = null;
    if (typeof required === 'function') {
      modelFactory = required;
    } else if (required && typeof required.default === 'function') {
      modelFactory = required.default;
    } else if (required && required.name && typeof required.init === 'function') {
      // Already a model instance/class exported directly
      db[required.name] = required;
      continue;
    } else {
      console.warn(`Skipping "${file}" — it does not export a model factory function.`);
      continue;
    }

    // Initialize model with appropriate args
    try {
      const model = (modelFactory.length === 1)
        ? modelFactory(sequelize)
        : modelFactory(sequelize, DataTypes);

      if (!model || !model.name) {
        console.warn(`Loaded "${file}" but it did not return a valid Sequelize Model instance.`);
        continue;
      }

      db[model.name] = model;
    } catch (err) {
      console.error(`Error initializing model from file "${file}":`, err && err.message ? err.message : err);
    }
  }
}

// Run associations if defined
Object.keys(db).forEach((name) => {
  if (db[name] && typeof db[name].associate === 'function') {
    try {
      db[name].associate(db);
    } catch (err) {
      console.error(`Error running associate() for model ${name}:`, err && err.message ? err.message : err);
    }
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

/*
Optional: quick connection test while developing
Uncomment to test that the connection works (useful for Neon troubleshoot).

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection authenticated successfully.');
  } catch (err) {
    console.error('Unable to authenticate database connection:', err);
  }
})();
*/
