import express, { json } from "express";
import cors from "cors";
import { port } from "./constant.js";
import connectDb from "./connectDb/connectmongoDb.js";
import bodyParser from "body-parser";

let app = express();
app.use(bodyParser.json());
app.use(cors());

connectDb(); //Using PORT from dotenv file

//test server with ping api
app.get("/ping", (req, res) => {
  res.send("Test");
});

//callback function for terminal message
app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
