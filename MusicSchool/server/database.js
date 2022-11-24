// bookshelf-app/server/db.js

// Import path module
const path = require("path");

// Get the location of database.sqlite file
const dbPath = path.resolve(__dirname, "db/database.sqlite");
console.log(dbPath);
// Create connection to SQLite database
const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true,
});

// Create a table in the database called "Users"
knex.schema
  // Make sure no "Users" table exists
  // before trying to create new
  .hasTable("Users")
  .then((exists) => {
    if (!exists) {
      // If no "Users" table exists
      // create new, with "uid", "username", "password", "role"
      // and use "uid" as a primary identification
      // and increment "uid" with every new record (user)
      return knex.schema
        .createTable("Users", (table) => {
          table.increments("uid").primary();
          table.string("username").unique();
          table.string("name");
          table.string("password");
          table.string("role");
        })
        .then(() => {
          // Log success message
          console.log("Table 'Users' created");
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`);
        });
    }
  })
  .then(() => {
    // Log success message
    console.log("done");
  })
  .catch((error) => {
    console.error(`There was an error setting up the database: ${error}`);
  });

knex.schema
  .hasTable("Instruments")
  .then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable("Instruments", (table) => {
          table.increments("iid").primary();
          table.string("name")
          table.string("type")
          table.string("serialNumber")
          table.string("status")
          table.integer("studioID")
          table.foreign("studioID").references("sid").inTable("Studios")
        })
        .then(() => {
          console.log("Table 'Instruments' created");
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`);
        });
    }
  })
  .then(() => {
    console.log("done");
  })
  .catch((error) => {
    console.error(`There was an error setting up the database: ${error}`);
  });

knex.schema
  .hasTable("Studio")
  .then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable("Studio", (table) => {
          table.increments("sid").primary();
          table.string("studioName");
        })
        .then(() => {
          console.log("Table 'Studio' created");
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`);
        });
    }
  })
  .then(() => {
    console.log("done");
  })
  .catch((error) => {
    console.error(`There was an error setting up the database: ${error}`);
  });

knex.schema
  .hasTable("Unavailabilities")
  .then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable("Unavailabilities", (table) => {
          table.integer("uid");
          table.foreign("uid").references("uid").inTable("Users")
          table.datetime("unavailableOn");
        })
        .then(() => {
          console.log("Table 'Unavilabilities' created");
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`);
        });
    }
  })
  .then(() => {
    console.log("done");
  })
  .catch((error) => {
    console.error(`There was an error setting up the database: ${error}`);
  });

knex.schema
  .hasTable("Jobs")
  .then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable("Jobs", (table) => {
          table.increments("jid").primary();
          table.string("jobName");
          table.integer("studioID");
          table.foreign("studioID").references("sid").inTable("Studios")
          table.integer("instrumentID");
          table.foreign("instrumentID").references("iid").inTable("Instruments")
          table.integer("staffID");
          table.foreign("staffID").references("uid").inTable("Users")
          table.date("jobDate");
          table.time("jobTime");
          table.string("jobStatus");
        })
        .then(() => {
          console.log("Table 'Jobs' created");
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`);
        });
    }
  })
  .then(() => {
    console.log("done");
  })
  .catch((error) => {
    console.error(`There was an error setting up the database: ${error}`);
  });

knex.schema
  .hasTable("JobRejectionRequest")
  .then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable("JobRejectionRequest", (table) => {
          table.increments("jrrid").primary();
          table.integer("jobID");
          table.foreign("jobID").references("jid").inTable("Jobs").onDelete('CASCADE')
          table.integer("staffID");
          table.foreign("staffID").references("uid").inTable("Users")
          table.string("reason");
          table.string("status");
          table.dateTime("requestCreatedOn");
          table.dateTime("requestUpdatedOn");
        })
        .then(() => {
          console.log("Table 'JobRejectionRequest' created");
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`);
        });
    }
  })
  .then(() => {
    console.log("done");
  })
  .catch((error) => {
    console.error(`There was an error setting up the database: ${error}`);
  });

knex.schema
  .hasTable("JobPreferences")
  .then((exists) => {
    if (!exists) {
      return knex.schema
        .createTable("JobPreferences", (table) => {
          table.integer("uid");
          table.foreign("uid").references("uid").inTable("Users")
          table.integer("type");
          table.foreign("type").references("type").inTable("Instruments")
          table.date("date");
        })
        .then(() => {
          console.log("Table 'JobPreferences' created");
        })
        .catch((error) => {
          console.error(`There was an error creating table: ${error}`);
        });
    }
  })
  .then(() => {
    console.log("done");
  })
  .catch((error) => {
    console.error(`There was an error setting up the database: ${error}`);
  });

// Just for debugging purposes:
// Log all data in "books" table
knex
  .select("*")
  .from("Users")
  .then((data) => console.log("data:", data))
  .catch((err) => console.log(err));

// Export the database
module.exports = knex;
