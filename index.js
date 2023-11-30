import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors"
import appllicantrouter from "./router/applicant.router"
dotenv.config();

var app = express();

const PORT = process.env.PORT || 8009;
app.use(express.json());

var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  };
  app.use(cors(corsOptions));
  app.use(express.static(__dirname));
  
app.listen(PORT, () => {
    console.log("Your server running on http://localhost:" + PORT);
  });

  async function main() {
    const uri = process.env.DB_NAME;
    mongoose
      .connect(uri)
      .then(() => {
        console.log("connected to mongodb");
      })
      .catch(() => {
        console.log("could not connect to mongodb");
      });
  }
  main();

  app.use("/applicant",appllicantrouter);