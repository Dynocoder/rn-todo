import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.APP_PORT || 3001;

app.get("/", (req, res) => {
  res.send("Hello World\n");
});

app.listen(port, () => {
  console.log(`Started server at port ${port}`);
});
