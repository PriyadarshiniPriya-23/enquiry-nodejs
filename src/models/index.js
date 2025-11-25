// src/models/index.js
// Central models loader for sequelize-cli compatibility and convenience.
// Loads every .js in this folder (except this file), calls the factory
// with (sequelize, DataTypes) or (sequelize) depending on declared arity,
// runs associations and exports db object: { ModelName: Model, sequelize, Sequelize }.

const fs = require('fs');
const path = require('path');
const { DataTypes, Sequelize } = require('sequelize');

function initModels(sequelizeInstance) {
  if (!sequelizeInstance || !(sequelizeInstance instanceof Sequelize)) {
    throw new Error('initModels requires a Sequelize instance as the first argument');
  }

  const db = {};
  const modelsDir = __dirname;

  const files = fs
    .readdirSync(modelsDir)
    .filter((f) => f.endsWith('.js') && f !== path.basename(__filename));

  for (const file of files) {
    const fullPath = path.join(modelsDir, file);
    let required;
    try {
      required = require(fullPath);
    } catch (err) {
      console.error(`Failed to require model file ${file}:`, err && err.message ? err.message : err);
      continue;
    }

    // resolve factory function if present
    let factory = null;
    if (typeof required === 'function') {
      factory = required;
    } else if (required && typeof required.default === 'function') {
      factory = required.default;
    } else if (required && required.name && typeof required.init === 'function') {
      // The file already exported a model instance/class (rare). Attach directly.
      db[required.name] = required;
      continue;
    } else {
      console.warn(`Skipping ${file} — no model factory found.`);
      continue;
    }

    // call factory: prefer (sequelize, DataTypes) if factory expects 2 args, otherwise call with sequelize
    try {
      let model;
      if (factory.length === 2) {
        model = factory(sequelizeInstance, DataTypes);
      } else {
        model = factory(sequelizeInstance);
      }

      if (!model || !model.name) {
        console.warn(`Model factory in ${file} did not return a valid model instance.`);
        continue;
      }

      db[model.name] = model;
    } catch (err) {
      console.error(`Error initializing model from file ${file}:`, err && err.message ? err.message : err);
    }
  }

  // run associations if present
  Object.keys(db).forEach((name) => {
    if (db[name] && typeof db[name].associate === 'function') {
      try {
        db[name].associate(db);
      } catch (err) {
        console.error(`Error running associate() for model ${name}:`, err && err.message ? err.message : err);
      }
    }
  });

  // Attach sequelize references
  db.sequelize = sequelizeInstance;
  db.Sequelize = Sequelize;

  return db;
}

// When required by sequelize-cli or other scripts, export initModels for explicit initialization.
// Also export a default initializer that tries to use src/db if no sequelize provided.
module.exports = initModels;

// Convenience: if somebody does `const models = require('./models')(sequelize)` style,
// support that too by exporting a function as default (same as initModels).
module.exports.default = initModels;
