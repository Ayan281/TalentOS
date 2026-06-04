const mongoose = require("mongoose")

async function connectDB() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DataBase Successfully...");
    
}
module.exports = connectDB;