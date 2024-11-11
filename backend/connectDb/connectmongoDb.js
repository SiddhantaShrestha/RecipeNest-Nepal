import mongoose from "mongoose";
import { dbUrl } from "../constant.js";

let connectDb = async () => {
  try {
    await mongoose.connect(`${dbUrl}`);
    console.log(
      `application is connected to database successfully at port ${dbUrl}`
    );
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDb;
