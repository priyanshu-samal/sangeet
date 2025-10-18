import mongoose from "mongoose";
import _config from "../config/config.js";



async function connectDB() {
  try {
    await mongoose.connect(_config.MONGO_URI, {
      
      
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

export default connectDB;

