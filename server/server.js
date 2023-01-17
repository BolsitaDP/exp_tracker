const express = require("express");

const app = express();

const cors = require("cors");

require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());

// mongoDB conn
const con = require("./db/connection.js");

// routes
app.use(require("./routes/route"));

con
  .then((db) => {
    if (!db) return process.exit(1);

    // Listen to the http server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    // Error in mongoDB conn
    app.on("error", (err) =>
      console.log(`Failed to Connect whit HTTP server: ${err}`)
    );
  })
  .catch((error) => {
    console.log(`Connection failed: ${error}`);
  });
