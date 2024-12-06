import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import redis from "redis";

dotenv.config();

const client = redis.createClient({
  url: process.env.DB_URL,
  password: process.env.DB_PASSWORD,
});
const app = express();
const port = process.env.APP_PORT || 3001;
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.get("/load", async (req, res) => {
  try {
    let todo_list;
    let exists = await client.exists("todo_list");
    if (exists == 0) {
      todo_list = [];
      await client.set("todo_list", JSON.stringify(todo_list));
    } else {
      todo_list = await client.get("todo_list");
    }
    console.log("loaded");
    // console.log(todo_list);
    const todo = JSON.parse(todo_list);
    res.json(todo);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.post("/save", async (req, res) => {
  try {
    let todo_list = req.body.todo_list;
    console.log("inside save: ");
    console.log(todo_list);

    await client.set("todo_list", JSON.stringify(todo_list));

    console.log("saved");
    res.json({ status: "save successful" });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.get("/clear", async (req, res) => {
  try {
    await client.set("todo_list", JSON.stringify([]));
    res.send({ status: "clear successful" });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
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
