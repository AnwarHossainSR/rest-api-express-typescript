import dotenv from "dotenv";
import express from "express";
dotenv.config();

const app = express();

app.use(express.json());

app.listen(4000, async () => {
  console.log("Server is running on port 4000");
});
