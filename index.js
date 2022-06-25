import express from "express";
import { append } from "express/lib/response";
import cors from "cors";
import { MongoClient } from "mongodb";
import joi from "joi";
import dotenv from "dotenv";
dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());

const mongoClient = new MongoClient(process.env.URL_CONNECT_MONGO);
let db;

mongoClient.connect().then(() => {
  db = mongoClient.db("bate_papo_uol");
});

server.post("/participants", async (req, res) => {});

server.get("/participants", async (req, res) => {});

server.post("/messages", async (req, res) => {});

server.get("/messages", async (req, res) => {});

server.post("/status", async (req, res) => {});

append.listen(5000);
