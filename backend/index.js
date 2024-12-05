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

// app.get("/", (req, res) => {
//   res.send("Hello World\n");
// });

app.get("/load", async (req, res) => {
  try {
    let exists = await client.exists("todo_list");
    let todo_list;
    if (exists == 0) {
      todo_list = [];
      await client.set("todo_list", JSON.stringify(todo_list));
    } else {
      todo_list = await client.get("todo_list");
    }
  } catch (error) {
    console.log(error);
    res.send(error);
  }

  console.log(todo_list);
  res.send(JSON.stringify(todo_list));
});

app.post("/save", async (req, res) => {
  try {
    let todo_list = req.body.todo_list;

    await client.set("todo_list", JSON.stringify(todo_list));

    res.send({ status: "save successful" });
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
