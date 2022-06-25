import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import joi from "joi";
import dotenv from "dotenv";
dotenv.config();
import dayjs from "dayjs";

const day = dayjs().format("HH:mm:ss");

const server = express();
server.use(cors());
server.use(express.json());

const mongoClient = new MongoClient(process.env.URL_CONNECT_MONGO);
let db;

mongoClient.connect().then(() => {
  db = mongoClient.db("bate_papo_uol");
});

const nameSchema = joi.object({ name: joi.string().required() });
const messageSchema = joi.object({
  to: joi.string().required(),
  text: joi.string().required(),
  type: joi.valid("message", "private_message").required(),
});

/* Participants Routes */
server.post("/participants", async (req, res) => {
  const { name } = req.body;

  const validation = nameSchema.validate(req.body);
  if (validation.error) {
    console.log(validation.error);
    res.sendStatus(422);
    return;
  }

  const check = await db.collection("participants").findOne(req.body);
  if (check !== null) {
    res.sendStatus(409);
    return;
  }

  try {
    await db
      .collection("participants")
      .insertOne({ name, lastStatus: Date.now() });
    res.sendStatus(201);

    await db.collection("messages").insertOne({
      from: name,
      to: "Todos",
      text: "entra na sala...",
      type: "status",
      time: day,
    });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

server.get("/participants", async (req, res) => {
  try {
    const users = await db.collection("participants").find().toArray();
    res.send(users);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

/* Messages Routes */
server.post("/messages", async (req, res) => {
  const { to, text, type } = req.body;
  const { user } = req.headers;

  const validationBody = messageSchema.validate(req.body);
  if (validationBody.error) {
    console.log(validationBody.error);
    res.sendStatus(422);
    return;
  }
  if (db.collection("participants").findOne(req.headers) === null) {
    res.sendStatus(422);
    return;
  }

  try {
    await db
      .collection("messages")
      .insertOne({ from: user, to, text, type, time: day });
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

server.get("/messages", async (req, res) => {
  try {
    const { user } = req.headers;

    const messages = await db
      .collection("messages")
      .find({
        $or: [
          { type: "message" },
          { type: "status" },
          { to: user },
          { from: user },
        ],
      })
      .toArray();
    res.send(messages);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

/* Status Routes */
server.post("/status", async (req, res) => {
  try {
    res.send([]);
  } catch (error) {}
});

server.listen(5000);
