require('dotenv').config();
const bcrypt = require('bcryptjs');

(async () => {
  const db = require('../src/db');

  try {
    await db.sequelize.authenticate();
    console.log("Database connected");

    await db.sequelize.sync(); // ensures tables exist

    const User = db.User;
    const AccessControl = db.AccessControl;

    const email = "admin@example.com";
    const username = "admin";
    const password = "admin123";

    // Check existing
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password_hash: hashed,
      firstname: "Super",
      lastname: "Admin",
      is_superuser: true,
      is_staff: true,
      is_active: true
    });

    await AccessControl.create({
      userId: user.id,
      role: "admin"
    });

    console.log("Admin Created Successfully:");
    console.log({ email, password });

    process.exit(0);

  } catch (err) {
    console.error("ERROR:", err);
    process.exit(1);
  }
})();
