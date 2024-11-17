import express, { json } from "express";
import cors from "cors";
import { port } from "./src/constant.js";
import connectDb from "./src/connectDb/connectmongoDb.js";
import bodyParser from "body-parser";
import registerRouter from "./src/Routes/registerRouter.js";

let expressApp = express();
expressApp.use(json());
expressApp.use(cors());

connectDb(); //Using PORT from dotenv file

//test server with ping api
expressApp.get("/ping", (req, res) => {
  res.send("Test");
});

//callback function for terminal message
expressApp.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});

expressApp.use("/register", registerRouter);
