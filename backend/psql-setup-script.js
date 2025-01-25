const { sequelize } = require('./db/models');

(async () => {
  try {
    // Validate that the SCHEMA environment variable is set
    if (!process.env.SCHEMA) {
      console.error("Error: SCHEMA environment variable is not set.");
      process.exit(1);
    }

    console.log(`Checking if schema "${process.env.SCHEMA}" exists...`);

    // Check if the schema exists
    const schemas = await sequelize.showAllSchemas({ logging: false });

    if (!schemas.includes(process.env.SCHEMA)) {
      console.log(`Schema "${process.env.SCHEMA}" does not exist. Creating it now...`);
      
      // Create the schema
      await sequelize.createSchema(process.env.SCHEMA);

      console.log(`Schema "${process.env.SCHEMA}" created successfully.`);
    } else {
      console.log(`Schema "${process.env.SCHEMA}" already exists.`);
    }
  } catch (err) {
    console.error("Error during schema setup:", err);
    process.exit(1);
  }
})();
