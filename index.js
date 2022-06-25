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
  try {
  } catch (error) {}
  res.send([]);
});

server.get("/messages", async (req, res) => {
  try {
  } catch (error) {}
  res.send([]);
});

/* Status Routes */
server.post("/status", async (req, res) => {
  try {
  } catch (error) {}
  res.send([]);
});

server.listen(5000);
