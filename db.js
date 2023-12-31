const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config();

const connectToMongo = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(console.log("DB CONNECTED"))
    .catch((error) => console.log(error));
};

module.exports = connectToMongo;
