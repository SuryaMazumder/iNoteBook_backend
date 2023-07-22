const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();
const mongoUri =
  "mongodb+srv://dummyuser:dummyuser@mernstack.5zw26ou.mongodb.net/";

const connectToMongo = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(console.log("DB CONNECTED"))
    .catch((error) => console.log(error));
};

module.exports = connectToMongo;
