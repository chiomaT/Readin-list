const { graphqlHTTP } = require("express-graphql");
const express = require("express");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config()

mongoose
  .connect(
    process.env.DB_CONNECTION
  )
  .then(() => console.log("connected to database successfully"))
  .catch((err) =>
    console.log("unable to connect to the database: ", err.message)
  );

const app = express();
//allow cross-origin request
app.use(cors());

app.use(express.static(path.resolve(__dirname, "./client/build")));

//use as middleware
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("now listening for request on port 4000");
});
