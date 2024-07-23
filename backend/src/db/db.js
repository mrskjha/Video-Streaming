import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    console.log("Connected to the database");
    console.log(`Database connected to ${connectionInstance}`);
  } catch (error) {
    console.log("Error connecting to the database", error);
    throw error;
  }
};

export default connectDB;