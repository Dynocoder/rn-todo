import express from "express";
import dotenv from "dotenv";
import redis from "redis";

dotenv.config();

const client = redis.createClient({
  url: process.env.DB_URL,
  password: process.env.DB_PASSWORD,
});
const app = express();
const port = process.env.APP_PORT || 3001;

app.get("/", (req, res) => {
  res.send("Hello World\n");
});

//TODO: get the todo list from the redis db
app.get("/load", (req, res) => {
  res.send("loading shit");
});

//TODO: save the todo list from the redis db
app.get("/save", (req, res) => {
  res.send("loading shit");
});

//TODO: clear the todo list(s) from the redis db
app.get("/clear", (req, res) => {
  res.send("loading shit");
});

client.connect();

client.on("connect", function () {
  console.log("Connection established with redis cloud");
});
client.on("error", function (err) {
  console.log("Error: " + err);
});
app.listen(port, () => {
  console.log(`Started server at port ${port}`);
});
